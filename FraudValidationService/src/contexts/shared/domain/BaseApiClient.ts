export interface BaseApiClient {
    get<T>(url: string, headers: Record<string, string>, service: string, params?: any): Promise<T>;
    post<T, V>(url: string, headers: Record<string, string>, body: T, service: string, params?: any): Promise<V>;
    put<T, V>(url: string, headers: Record<string, string>, body: T, service: string, params?: any): Promise<V>;
    delete<T>(url: string, headers: Record<string, string>, service: string, params?: any): Promise<T>;
    deleteWithBody<T, V>(
      url: string,
      headers: Record<string, string>,
      body: T,
      service: string,
      params?: any
    ): Promise<V>;
  }
  