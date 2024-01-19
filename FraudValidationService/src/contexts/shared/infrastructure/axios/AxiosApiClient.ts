import { BaseApiClient } from '../../domain/BaseApiClient';
import axios from './';
import { ServiceUnavailable } from '../exceptions/ServiceUnavailable';
import BaseException from '../exceptions/BaseException';

export class AxiosApiClient implements BaseApiClient {
  private client = axios;

  async get<T>(url: string, headers: Record<string, string>, service: string, params?: any): Promise<T> {
    const response = await this.client({ headers, method: 'GET', ...params }, url, service);
    if (response.status >= 500) {
      throw new ServiceUnavailable(`Service: ${service} is unavailable`, response.status, response.error);
    }
    if (response.status >= 400) {
      throw new BaseException('Service', '', response.status, response.error);
    }
    return response.data as T;
  }

  async post<T, V>(url: string, headers: Record<string, string>, body: T, service: string, params?: any): Promise<V> {
    const response = await this.client({ headers, method: 'POST', body, ...params }, url, service);
    if (response.status >= 500) {
      throw new ServiceUnavailable(`Service: ${service} is unavailable`, response.status, response.error);
    }
    if (response.status >= 400) {
      throw new BaseException('Service', '', response.status, response.error);
    }
    return response.data as V;
  }

  async put<T, V>(url: string, headers: Record<string, string>, body: T, service: string, params?: any): Promise<V> {
    const response = await this.client({ headers, method: 'PUT', body, ...params }, url, service);
    if (response.status >= 500) {
      throw new ServiceUnavailable(`Service: ${service} is unavailable`, response.status, response.error);
    }
    if (response.status >= 400) {
      throw new BaseException('Service', '', response.status, response.error);
    }
    return response.data as V;
  }

  async delete<T>(url: string, headers: Record<string, string>, service: string, params?: any): Promise<T> {
    const response = await this.client({ headers, method: 'DELETE', ...params }, url, service);
    if (response.status >= 500) {
      throw new ServiceUnavailable(`Service: ${service} is unavailable`, response.status, response.error);
    }
    if (response.status >= 400) {
      throw new BaseException('Service', '', response.status, response.error);
    }
    return response.data as T;
  }

  // Bad implemented: DELETE should not receive body
  async deleteWithBody<T, V>(
    url: string,
    headers: Record<string, string>,
    body: T,
    service: string,
    params?: any
  ): Promise<V> {
    const response = await this.client({ headers, method: 'DELETE', body, ...params }, url, service);
    if (response.status >= 500) {
      throw new ServiceUnavailable(`Service: ${service} is unavailable`, response.status, response.error);
    }
    if (response.status >= 400) {
      throw new BaseException('Service', '', response.status, response.error);
    }
    return response.data as V;
  }
}
