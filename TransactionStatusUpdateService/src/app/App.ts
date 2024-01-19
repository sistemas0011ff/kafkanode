import { Server } from './server';

export class App {
  server?: Server;

  async start(appName: string, basePath: string, port: string, enviroment: string) {
    this.server = new Server(appName, basePath, port, enviroment);
    return this.server.listen();
  }
  //comentado por cambio a https, efajardog-e160823
  // get httpServer() {
  //   return this.server?.getHTTPServer();
  // }

  get httpsServer() {
    return this.server?.getHTTPSServer();
  }
  async stop() {
    return this.server?.stop();
  }
}
