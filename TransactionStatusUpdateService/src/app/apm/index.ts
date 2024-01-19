
import apm from 'elastic-apm-node';
import { config } from '../config/index';
// import { config } from '../config';

// export class Apmsasaas {
//   static start(): void {
//     apm.start({
//       maxQueueSize: config.get('apm.maxQueueSize'),
//       secretToken: config.get('apm.secretToken'),
//       serviceName: config.get('apm.serviceName'),
//       environment: config.get('apm.environment'),
//       serverUrl: config.get('apm.serverUrl'),
//       captureHeaders: config.get('apm.captureHeaders'),
//       errorOnAbortedRequests: config.get('apm.errorAbortedRequests'),
//       captureBody: 'off',
//       ignoreUrls: ['/health', /^\/health\//i]
//     });
//   }
// }
/*
export class Apm {
  static start(): void {
    apm.start({
      maxQueueSize: 100,   
      secretToken: '77fd935c994e31d982d419d2913bd3845a9e7744',       
      serviceName: 'ntc-aut-rp',      
      environment: 'development',
      serverUrl: 'http://localhost:8200',
      captureHeaders: true,
      errorOnAbortedRequests: true,
      captureBody: 'off',
      ignoreUrls: ['/health', /^\/health\//i]
    });
  }
}
*/

class Apm {
  constructor() {
    this.initApm();
  }

  private initApm(): void {
    apm.start({
      maxQueueSize: 100,   
      secretToken: '77fd935c994e31d982d419d2913bd3845a9e7744',       
      serviceName: 'ntc-aut-rp',      
      environment: 'development',
      serverUrl: 'http://localhost:8200',
      captureHeaders: true,
      errorOnAbortedRequests: true,
      captureBody: 'off',
      ignoreUrls: ['/health', /^\/health\//i]
    });
  }
}
// config.get('apm.enabled')
// Función autoinvocada -  iniciar el agente APM al importar la clase
(() => {
  if (config.get('apm.enabled')) {
    new Apm(); 
  }
})();


