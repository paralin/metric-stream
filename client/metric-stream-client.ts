import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as _ from 'lodash';

export interface IMetricSubscription {
  id: string;
  metric: string;
  query: IMetricDatapointQuery;
  // When subscription is ended, with reason
  onUnsubscribe: Subject<string>;
  unsubscribe: () => void;
  data: BehaviorSubject<IMetricSubscriptionData>;
}

export interface IMetricDatapointReplaced {
  old_datapoint: IMetricDatapoint;
  new_datapoint: IMetricDatapoint;
}

export interface IMetricSubscriptionData {
  // Subscription IDs of data
  subscriptionIds: string[];

  // Sorted array of datapoints
  datapoints: IMetricDatapoint[];
  // Timestamps for each datapoint, sorted, for faster queries
  timestamps: number[];

  datapointAdded: Subject<IMetricDatapoint>;
  datapointRemoved: Subject<IMetricDatapoint>;
  datapointReplaced: Subject<IMetricDatapointReplaced>;

  initialSetComplete: BehaviorSubject<boolean>;
  disposed: BehaviorSubject<boolean>;
  series: BehaviorSubject<IMetricSeries>;
}

export class MetricStreamClient {
  private subscriptions: { [id: string]: IMetricSubscription };
  private subIdCounter: number;

  constructor(private send: (message: IMSClientMessage) => void) {
    this.subscriptions = {};
    this.subIdCounter = 0;
  }

  public handleMessage(message: IMSServerMessage) {
    if (message.subscribe_result) {
      this.handleSubscribeResult(message.subscribe_result);
    }
    if (message.unsubscribe_result) {
      this.handleUnsubscribeResult(message.unsubscribe_result);
    }
    if (message.datapoint) {
      this.handleDatapoint(message.datapoint);
    }
  }

  public subscribe(metricName: string, query: IMetricDatapointQuery): IMetricSubscription {
    let id = (this.subIdCounter++) + '';
    let unsubscribeCalled = false;
    let sub: IMetricSubscription = {
      id: id,
      query: query,
      metric: metricName,
      onUnsubscribe: new Subject<string>(),
      unsubscribe: () => {
        if (unsubscribeCalled) {
          return;
        }
        unsubscribeCalled = true;
        this.clearSubscription(id);
      },
      data: new BehaviorSubject<IMetricSubscriptionData>(null),
    };
    this.subscriptions[sub.id] = sub;
    this.sendSubscribe(sub);
    return sub;
  }

  // Cleanup everything
  // If disposed = true then don't send any messages
  public dispose(disposed: boolean = false) {
    if (disposed) {
      // Don't send anything anymore
      this.send = (message: any) => {
        return;
      };
    }

    for (let subId in this.subscriptions) {
      if (!this.subscriptions.hasOwnProperty(subId)) {
        continue;
      }
      this.unsubscribe(subId);
    }
  }

  private unsubscribe(subId: string) {
    let sub = this.clearSubscription(subId, 'Client unsubscribed.');
    if (!sub) {
      return;
    }
    this.sendUnsubscribe(subId);
  }

  private clearSubscription(subId: string, reason: string = ''): IMetricSubscription {
    let sub = this.subscriptions[subId];
    if (!sub) {
      return null;
    }
    delete this.subscriptions[subId];
    if (reason) {
      sub.onUnsubscribe.next(reason);
    }
    if (sub.data.value) {
      // Remove the subscription ID from data
      if (sub.data.value.subscriptionIds.length > 1) {
        let subIdIdx = sub.data.value.subscriptionIds.indexOf(subId);
        if (subIdIdx > -1) {
          sub.data.value.subscriptionIds.splice(subIdIdx, 1);
        }
      } else {
        sub.data.value.subscriptionIds = [];
      }
      // Dispose the data if needed
      if (!sub.data.value.subscriptionIds.length) {
        sub.data.value.disposed.next(true);
        sub.data.value.datapoints = null;
      }
      sub.data.next(null);
    }
    return sub;
  }

  private sendUnsubscribe(subId: string) {
    this.send({
      metric_unsubscribe: {
        subscription_id: subId,
      },
    });
  }

  private sendSubscribe(sub: IMetricSubscription) {
    this.send({
      metric_subscribe: {
        context: {
          identifier: {
            id: sub.metric,
          },
        },
        query: sub.query,
        subscription_id: sub.id,
      },
    });
  }

  private createDataContainer(sub: IMetricSubscription) {
    if (sub.data.value) {
      return;
    }
    sub.data.next({
      subscriptionIds: [sub.id],
      datapoints: [],
      timestamps: [],
      datapointAdded: new Subject<IMetricDatapoint>(),
      datapointRemoved: new Subject<IMetricDatapoint>(),
      datapointReplaced: new Subject<IMetricDatapointReplaced>(),
      initialSetComplete: new BehaviorSubject<boolean>(false),
      disposed: new BehaviorSubject<boolean>(false),
      series: new BehaviorSubject<IMetricSeries>(null),
    });
  }

  private handleDatapoint(message: IMSDatapoint) {
    let subId = message.subscription_id;
    let sub = this.subscriptions[subId];
    if (!sub) {
      this.sendUnsubscribe(subId);
      return;
    }
    if (!sub.data.value) {
      // This is an error condition
      return;
    }
    let data = message.data;
    switch (data.response_type) {
      case 0: // ListDatapointResponseType.LIST_DATAPOINT_SERIES_DETAILS
        sub.data.value.series.next(data.series);
        break;
      case 2: // ListDatapointResponseType.LIST_DATAPOINT_DEL:
        this.removeDatapoint(sub.data.value, data.datapoint.timestamp);
        break;
      case 3: // ListDatapointResponseType.LIST_DATAPOINT_REPLACE:
        if (this.removeDatapoint(sub.data.value, data.datapoint.timestamp, data.datapoint)) {
          // If we don't remove one, just add it
          this.insertDatapoint(sub.data.value, data.datapoint);
        }
        break;
      case 1: // ListDatapointResponseType.LIST_DATAPOINT_ADD:
        this.insertDatapoint(sub.data.value, data.datapoint);
        break;
      case 4: // ListDatapointResponseType.LIST_DATAPOINT_INITIAL_SET_COMPLETE:
        sub.data.value.initialSetComplete.next(true);
        break;
      default:
        break;
    }
  }

  // Sorted insert of datapoint
  private insertDatapoint(subData: IMetricSubscriptionData, datapoint: IMetricDatapoint) {
    let idx = _.sortedIndex(subData.timestamps, datapoint.timestamp);
    subData.timestamps.splice(idx, 0, datapoint.timestamp);
    subData.datapoints.splice(idx, 0, datapoint);
  }

  // Remove a datapoint
  private removeDatapoint(subData: IMetricSubscriptionData,
                          timestamp: number,
                          replaceWith: IMetricDatapoint = null): boolean {
    let idx = _.sortedIndexOf(subData.timestamps, timestamp);
    if (idx < 0) {
      return false;
    }
    let old = subData.datapoints[idx];
    if (replaceWith) {
      subData.timestamps[idx] = replaceWith.timestamp;
      subData.datapoints[idx] = replaceWith;
      subData.datapointReplaced.next({
        old_datapoint: old,
        new_datapoint: replaceWith,
      });
      return true;
    }
    subData.timestamps.splice(idx, 1);
    subData.datapoints.splice(idx, 1);
    subData.datapointRemoved.next(old);
    return true;
  }

  private handleSubscribeResult(message: IMSSubscribeResult) {
    let subId = message.subscription_id;
    let sub = this.subscriptions[subId];
    if (!sub) {
      if (message.error) {
        return;
      }
      this.sendUnsubscribe(subId);
      return;
    }
    if (message.error) {
      switch (message.error) {
        // Bad ID
        case 1:
          this.clearSubscription(subId, 'Bad ID, try again.');
          return;
        case 2:
          this.clearSubscription(subId, 'Error talking to DB, try again.');
          return;
        default:
          this.clearSubscription(subId, message.error_details);
          return;
      }
    }
    if (message.alias_subscription_id && message.alias_subscription_id.length) {
      let aliasSub = this.subscriptions[message.alias_subscription_id];
      if (!aliasSub) {
        // Respin the subscription after unsubscribing both in order.
        this.sendUnsubscribe(message.alias_subscription_id);
        this.sendUnsubscribe(message.subscription_id);
        this.sendSubscribe(sub);
        return;
      }
      if (!aliasSub.data.value) {
        this.createDataContainer(aliasSub);
      }
      aliasSub.data.value.subscriptionIds.push(message.subscription_id);
      sub.data.next(aliasSub.data.value);
      return;
    }
    // Init a empty data container
    this.createDataContainer(sub);
  }

  private handleUnsubscribeResult(message: IMSUnsubscribeResult) {
    let subId = message.subscription_id;
    let sub = this.subscriptions[subId];
    if (!sub) {
      return;
    }
    this.clearSubscription(subId, 'Server unsubscribed.');
  }
}
