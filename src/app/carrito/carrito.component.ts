import { Component, OnInit } from '@angular/core';
import { ProductoCart } from '../producto-cart'
import { ProductoCartService } from '../producto-cart.service'
import { Cart } from '../cart'
import { CartService } from '../cart.service'

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  data: ProductoCart[]
  data2: Cart[]

  current_product_card : ProductoCart
  current_card : Cart

  constructor(private service: ProductoCartService, private service2: CartService) {
    this.data = []
    this.data2 = []
  }

  ngOnInit(): void {
    this.service.read().subscribe( (res: ProductoCart[]) =>{
      this.data = res
      this.current_product_card = new ProductoCart()
      this.current_card = new Cart()
    })
  }

  delete(id){
    this.service.delete(id).subscribe(res=>{
      this.ngOnInit()
    })
  }

  update(product_id, id){
    this.current_product_card.id = id
    this.current_product_card.product_id = product_id
    this.current_product_card.cart_id = 1
    this.service.update(this.current_product_card).subscribe(res=>{
      this.current_product_card = new ProductoCart()
      this.ngOnInit()
    })
  }

  updateCard(id){
    this.current_card.id = id
    this.current_card.status = "completed" // solo puede cambiarse a completed
    this.service2.update(this.current_card).subscribe(res=>{
      this.ngOnInit()
    })
  }

}
