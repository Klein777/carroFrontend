import { Injectable } from '@angular/core'
import { Producto } from './producto'
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  data: Producto[]
  constructor(private http: HttpClient) { }

  read(){
    return this.http.get('http://localhost:8080/product')
  }
  insert(data: Producto){
    return this.http.post('http://localhost:8080/product', data)
  }
}
