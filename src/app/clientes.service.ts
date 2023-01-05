import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs' 

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  urlBase = 'http://localhost:8080/clientes'
  clients: any;

  constructor(private http: HttpClient ) { }

  getClients(): Observable<Object> {
    let url = this.urlBase;
    let response = this.http.get(url);
    return response;
  }
}
