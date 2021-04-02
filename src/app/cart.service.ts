import { Injectable } from '@angular/core';
import { Cart } from './cart'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  data: Cart[]
  constructor(private http: HttpClient) { }
  update(data: Cart){
    return this.http.put('http://127.0.0.1:8000/updatecard/' + data.id, data)
  }
}
