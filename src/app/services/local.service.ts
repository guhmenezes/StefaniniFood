import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  local!:string;

  headers = new HttpHeaders()
    .append('Connection', 'keep-alive')
    .append('host', 'google.com:80')
    .append('Accept-Encoding', 'gzip,deflate,br')
    .append('Accept', '*/*')
    .append('user-agent', 'PostmanRuntime/7.29.2')
    .append('responseType', 'text')

  constructor(private http: HttpClient) { }

  getAddress(){
    this.http.get('http://www.google.com/maps/place/@-22.7585502,-47.1482967/-22.7585502,-47.1482967', {responseType: 'text'}).subscribe({
      next: response => {
        this.local = response;
        return response
      }
    })
  }
}
