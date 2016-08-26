
export class MetricStreamServer {
  public addClient(identifier: string) {
    // Remove client if it already exists
    this.removeClient(identifier);
  }

  public removeClient(identifier: string) {
    // 
  }

  public handleMessage(clientIdentifier: string, message: MSClientMessage) {
    //
  }
}
