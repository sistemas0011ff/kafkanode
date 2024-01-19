import * as glob from 'glob';
import { Router } from 'express';

function register(routePath: string, router: Router) {
  const route = require(routePath);
  route.register(router);
}

export function registerRoutes(router: Router) {
  const dirname = process.platform === 'win32' ? __dirname.replace(/\\/g, '/') : __dirname;
  const routes = glob.sync(dirname + '/**/*.route.*');
  routes.forEach(route => register(route, router));
}

 