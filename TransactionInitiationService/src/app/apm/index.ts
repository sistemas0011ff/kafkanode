
import apm from 'elastic-apm-node';
import { config } from '../config/index';
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
(() => {
  if (config.get('apm.enabled')) {
    new Apm(); 
  }
})();


