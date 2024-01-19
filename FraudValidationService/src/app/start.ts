import { App } from './App';
import { config } from './config';

try {
  const appName = 'scan-and-go-bff';
  const basePath = config.get('http.basePath');
  const port = config.get('http.port');
  const enviroment = config.get('env');
  console.log("env start:",enviroment); 
  new App().start(appName, basePath, port.toString(), enviroment);
} catch (e) {
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.error({ message: 'uncaughtException', stack: err.stack });
  process.exit(1);
});

