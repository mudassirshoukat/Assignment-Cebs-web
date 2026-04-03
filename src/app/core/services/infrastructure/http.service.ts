import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private http: HttpClient) {}

  // ---------------------------
  // GET
  // ---------------------------
  get<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http.get<T>(url, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers),
    });
  }

  // ---------------------------
  // POST
  // ---------------------------
  post<T>(url: string, body?: any, headers?: any): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: this.buildHeaders(headers),
    });
  }

  // ---------------------------
  // PUT
  // ---------------------------
  put<T>(url: string, body?: any, headers?: any): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: this.buildHeaders(headers),
    });
  }

    // ---------------------------
  // PATCH
  // ---------------------------
  patch<T>(url: string, body?: any, headers?: any): Observable<T> {
    return this.http.patch<T>(url, body, {
      headers: this.buildHeaders(headers),
    });
  }

  // ---------------------------
  // DELETE
  // ---------------------------
  delete<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http.delete<T>(url, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers),
    });
  }

  // ============================
  // Helpers
  // ============================

  // private buildUrl(url: string): string {
  //   if (url.startsWith('http')) return url; // full URL case
  //   return `${this.baseUrl}/${url}`;
  // }

  private buildHeaders(customHeaders?: any): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => {
        headers = headers.set(key, customHeaders[key]);
      });
    }

    return headers;
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return httpParams;
  }
}
