export class MetricStreamClient {
  constructor(private send: (message: IMSClientMessage)) {
  }

  public handleMessage(message: IMSServerMessage) {
    if (message.subscribe_result) {
      this.handleSubscribeResult(message.subscribe_result);
    }
    if (message.unsubscribe_result) {
      this.handleUnsubscribeResult(message.unsubscribe_result);
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

  private handleSubscribeResult(message: IMSSubscribeResult) {
    //
  }

  private handleUnsubscribeResult(message: IMSUnsubscribeResult) {
    //
  }
}
