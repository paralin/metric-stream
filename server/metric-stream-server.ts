
/* Storage for a remote client */
class MetricStreamClient {
  constructor(private id: string,
              private send: (message: IMSServerMessage) => void) {
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
    //
  }

  private handleUnsubscribe(message: IMSUnsubscribe) {
    //
  }

}

export class MetricStreamServer {
  private clients: { [identifier: string]: MetricStreamClient };

  constructor() {
    this.clients = {};
  }

  public addClient(identifier: string, send: (message: IMSServerMessage) => void) {
    // Remove client if it already exists
    this.removeClient(identifier);
    this.clients[identifier] =
      new MetricStreamClient(identifier, (message: IMSServerMessage) => {
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
