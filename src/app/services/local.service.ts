import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  API_URL = environment.API_LOC;
  API_KEY = environment.API_KEY;

  // local!:string;

  // headers = new HttpHeaders()
  //   .append('Connection', 'keep-alive')
  //   .append('host', 'google.com:80')
  //   .append('Accept-Encoding', 'gzip,deflate,br')
  //   .append('Accept', '*/*')
  //   .append('user-agent', 'PostmanRuntime/7.29.2')
  //   .append('responseType', 'text')

  constructor(private http: HttpClient) { }

  getAddress(lat: number, long: number): Observable<any>{
    return this.http.get(`${this.API_URL}${lat},${long}${this.API_KEY}`)
  }
}
