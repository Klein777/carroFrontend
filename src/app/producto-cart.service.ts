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
    return this.http.get('http://127.0.0.1:8000/carritodetalles')
  }
  insert(data: ProductoCart){
    return this.http.post('http://127.0.0.1:8000/carritodetalles', data)
  }
  update(data: ProductoCart){
    return this.http.put('http://127.0.0.1:8000/carritodetalles/' + data.id, data)
  }
  delete(id){
    return this.http.delete('http://127.0.0.1:8000/carritodetalles/' + id)
  }
}
