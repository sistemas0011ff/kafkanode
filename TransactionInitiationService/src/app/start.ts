import { App } from './App';
import { config } from './config'; 

try { 
  const appName = 'TransactionInitiationService';
  const basePath = config.get('http.basePath');
  const port = config.get('http.port');
  const enviroment = config.get('env');  
  new App().start(appName, basePath, port.toString(), enviroment);
} catch (e) {
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.error({ message: 'uncaughtException', stack: err.stack });
  process.exit(1);
});

