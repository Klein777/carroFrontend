import { Injectable } from '@angular/core';
import { ProductoCart } from './producto-cart'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ProductoCartService {

  data: ProductoCart[]
  constructor(private http: HttpClient) { }

  read(){
    return this.http.get('http://localhost:8080/carritodetalles')
  }
  insert(data: ProductoCart){
    return this.http.post('http://localhost:8080/carritodetalles', data)
  }
  update(data: ProductoCart){
    return this.http.put('http://localhost:8080/carritodetalles/' + data.id, data)
  }
  delete(id){
    return this.http.delete('http://localhost:8080/carritodetalles/' + id)
  }
}
