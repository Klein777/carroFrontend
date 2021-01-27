import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto'
import { ProductoService } from '../producto.service'
import { ProductoCart } from '../producto-cart'
import { ProductoCartService } from '../producto-cart.service'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  data: Producto[]

  data2: ProductoCart[]

  current_product : Producto

  current_product_card : ProductoCart

  crud_operation = {is_new: false, is_visible: false}

  constructor(private service: ProductoService, private service2: ProductoCartService) {
    this.data = []
  }

  ngOnInit(): void {
    this.service.read().subscribe( (res: Producto[]) =>{
      this.data = res
      this.current_product = new Producto()
      this.current_product_card = new ProductoCart()
    })
  }

  new(){
    this.current_product = new Producto()
    this.crud_operation.is_visible = true
    this.crud_operation.is_new = true
  }

  save(){
    if(this.crud_operation.is_new){
      this.service.insert(this.current_product).subscribe(res=>{
        this.current_product = new Producto()
        this.crud_operation.is_visible = false
        this.ngOnInit()
      })
    }
  }

  saveProductoCart(id, data: NgForm){
    this.current_product_card.quantity = data.value.quantity
    this.current_product_card.product_id = id
    this.current_product_card.cart_id = 1 //carrito unico por defecto cuyo valor siempre es 1
    this.service2.insert(this.current_product_card).subscribe(res=>{
      this.current_product = new Producto()
      this.crud_operation.is_visible = false
      this.ngOnInit()
    })
  }

}
