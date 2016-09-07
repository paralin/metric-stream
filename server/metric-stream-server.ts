import * as _ from 'lodash';

// A container for the RPC query
class MetricStreamQuery {
  // List of subscriptions
  private subscriptions: MetricStreamSubscription[];
  private rpcCall: any;
  private disposed: boolean;

  constructor(public query: IMetricDatapointQuery,
              public context: IRequestContext,
              private metricService: any) {
    this.subscriptions = [];
    this.initCall();
  }

  public subscribe(sub: MetricStreamSubscription) {
    if (this.subscriptions.length) {
      sub.sendAliasSubscription(this.subscriptions[0].sub.subscription_id);
    }
    this.subscriptions.push(sub);
  }

  public unsubscribe(sub: MetricStreamSubscription) {
    let idx = this.subscriptions.indexOf(sub);
    if (idx >= 0) {
      this.subscriptions.splice(idx, 1);
    }
    if (!this.subscriptions.length) {
      this.dispose();
    }
  }

  public dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    if (this.rpcCall) {
      this.rpcCall.end();
      this.rpcCall = null;
    }
    for (let sub of this.subscriptions) {
      sub.dispose();
    }
  }

  private initCall() {
    this.rpcCall = this.metricService.listDatapoint({
      tail: true,
      include_initial: true,
      context: this.context,
      query: this.query,
    });
    this.rpcCall.on('end', () => {
      if (this.disposed) {
        return;
      }
      // ended
      this.rpcCall = null;
      this.dispose();
    });
    this.rpcCall.on('data', (data: IListDatapointResponse) => {
      if (this.disposed) {
        return;
      }
      this.subscriptions[0].sendDatapoint(data);
    });
  }
}

// A container for a single subscription ID
class MetricStreamSubscription {
  private hasSentSubscribeResult: boolean;
  private disposed: boolean;
  constructor(public query: MetricStreamQuery,
              public sub: IMSSubscribe,
              public send: (message: IMSServerMessage) => void,
              private unregister: () => void) {
    query.subscribe(this);
  }

  // Handle a datapoint
  public sendDatapoint(data: IListDatapointResponse) {
    if (!this.hasSentSubscribeResult) {
      this.hasSentSubscribeResult = true;
      this.send({
        subscribe_result: {
          subscription_id: this.sub.subscription_id,
        },
      });
    }
    this.send({
      datapoint: {
        subscription_id: this.sub.subscription_id,
        data: data,
      },
    });
  }

  public sendAliasSubscription(aliasId: string) {
    if (this.hasSentSubscribeResult) {
      return;
    }
    this.hasSentSubscribeResult = true;
    this.send({
      subscribe_result: {
        subscription_id: this.sub.subscription_id,
        alias_subscription_id: aliasId,
      },
    });
  }

  public dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.query.unsubscribe(this);
    this.sendUnsubscribe();
    this.unregister();
  }

  private sendUnsubscribe() {
    if (!this.hasSentSubscribeResult) {
      this.hasSentSubscribeResult = true;
      this.send({
        subscribe_result: {
          error: 2,
          error_details: 'No data received before unsubscribe.',
        },
      });
      return;
    }
    this.send({
      unsubscribe_result: {
        subscription_id: this.sub.subscription_id,
      },
    });
  }
}

/* Storage for a remote client */
class MetricStreamClient {
  private subscriptions: { [id: string]: MetricStreamSubscription };
  constructor(private id: string,
              private metricService: any,
              private send: (message: IMSServerMessage) => void) {
    this.subscriptions = {};
  }

  public handleMessage(message: IMSClientMessage) {
    if (message.metric_unsubscribe) {
      this.handleUnsubscribe(message.metric_unsubscribe);
    }
    if (message.metric_subscribe) {
      this.handleSubscribe(message.metric_subscribe);
    }
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
  }

  private handleSubscribe(message: IMSSubscribe) {
    // Initial request IDs
    let subId = message.subscription_id;
    let subscribeResult: IMSSubscribeResult = {
      error: 0,
      error_details: null,
      subscription_id: subId,
    };
    if (!subId || subId.length < 1 || subId.length > 100) {
      subscribeResult.error = 1;
      subscribeResult.error_details = 'ID not specified or bad length.';
    } else if (this.subscriptions[subId]) {
      subscribeResult.error = 1;
      subscribeResult.error_details = 'Duplicate subscription ID.';
    }

    if (subscribeResult.error) {
      this.send({
        subscribe_result: subscribeResult,
      });
      return;
    }

    // Create metric subscription here
    // Search for query that matches
    let query: MetricStreamQuery;
    for (let tsubId in this.subscriptions) {
      if (!this.subscriptions.hasOwnProperty(subId)) {
        continue;
      }
      let tsub = this.subscriptions[tsubId];
      if (!tsub) {
        continue;
      }
      if (_.isEqual(message.query, tsub.sub.query)) {
        query = tsub.query;
        break;
      }
    }
    if (!query) {
      query = new MetricStreamQuery(message.query, message.context, this.metricService);
    }
    this.subscriptions[subId] = new MetricStreamSubscription(query, message, this.send, () => {
      delete this.subscriptions[subId];
    });
  }

  private handleUnsubscribe(message: IMSUnsubscribe) {
     let sub = this.subscriptions[message.subscription_id];
     if (!sub) {
       this.send({
         unsubscribe_result: {
           subscription_id: message.subscription_id,
         },
       });
       return;
     }
     sub.dispose();
  }
}

export class MetricStreamServer {
  private clients: { [identifier: string]: MetricStreamClient };

  constructor(private metricService: any) {
    this.clients = {};
  }

  public addClient(identifier: string, send: (message: IMSServerMessage) => void) {
    // Remove client if it already exists
    this.removeClient(identifier);
    this.clients[identifier] =
      new MetricStreamClient(identifier, this.metricService, (message: IMSServerMessage) => {
      send(message);
    });
  }

  // If disposed = true don't send any messages
  public removeClient(identifier: string, disposed: boolean = false) {
    let client = this.clients[identifier];
    if (!client) {
      return;
    }
    delete this.clients[identifier];
    client.dispose(disposed);
  }

  public handleMessage(clientIdentifier: string, message: IMSClientMessage) {
    let client = this.clients[clientIdentifier];
    if (!client) {
      return;
    }
    client.handleMessage(message);
  }
}
