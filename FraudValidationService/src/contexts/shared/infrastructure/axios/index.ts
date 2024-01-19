/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */
import axios from 'axios';
import rtracer from 'cls-rtracer';

const { npm_package_name: npmPackageName, npm_package_version: npmPackageVersion, NODE_ENV } = process.env;

if (axios.defaults.headers) {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.headers.common['User-Agent'] = `${npmPackageName}-${npmPackageVersion}-${NODE_ENV}`;
}

export default (params: any, url: string, service: string = ''): any => {
  const { headers, method, body, ...other } = params;
  const startTime = Number(new Date());
  return axios({
    headers: {
      ...headers,
      trackId: rtracer.id()
    },
    method,
    url,
    data: body,
    ...other
  })
    .then(response => {
      log.info({
        action: 'response',
        service,
        duration: Number(new Date()) - startTime,
        url,
        path: response.request.path,
        method,
        request: {
          content: body
        },
        response: {
          status: response.status,
          content: response.data
        }
      });
      return response;
    })
    .catch(error => {
      if (error.response) {
        log.error({
          action: 'http-request',
          service,
          duration: Number(new Date()) - startTime,
          url,
          path: error?.request?.path,
          method,
          request: {
            content: body
          },
          response: {
            status: error.response.status,
            content: error.response.data
          }
        });
        return {
          error: error.response.data,
          status: error.response.status
        };
      }
      if (error.request) {
        log.error({
          action: 'http-request',
          service,
          duration: Number(new Date()) - startTime,
          url,
          path: error.request && error.request._options && error.request._options.path,
          method,
          request: {
            content: body
          },
          response: {
            status: 504,
            content: error?.message
          }
        });
        return {
          error: error.message,
          status: 504
        };
      }
      log.fatal({
        action: 'http-request',
        service,
        duration: Number(new Date()) - startTime,
        url,
        request: {
          content: body
        },
        description: error?.message,
        stack: error?.stack
      });
      return {
        error: error?.message
      };
    });
};
