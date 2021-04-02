import { Component, OnInit } from '@angular/core';
import { ProductoCart } from '../producto-cart'
import { Cart } from '../cart'
import { FirebaseServiceService } from '../services/firebase-service.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  current_product_card : ProductoCart
  current_card : Cart

  productCartForm: FormGroup;

  collection = {count: 0, data: []}

  constructor(public firebaseServiceService: FirebaseServiceService, public fb: FormBuilder) {}

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  ngOnInit(): void {
    
    this.productCartForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigo: ['', Validators.required],
      precio: ['', Validators.required],
      impuesto: ['', Validators.required],
      stock: ['', Validators.required],
      product_key: ['', Validators.required],
      cart_key: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    this.firebaseServiceService.readProductCart().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          id: e.payload.doc.id,
          nombre: e.payload.doc.data().nombre,
          codigo: e.payload.doc.data().codigo,
          descripcion: e.payload.doc.data().descripcion,
          precio: e.payload.doc.data().precio,
          impuesto: e.payload.doc.data().impuesto,
          stock: e.payload.doc.data().stock,
          cart_key: e.payload.doc.data().cart_key,
          product_key: e.payload.doc.data().product_key,
          quantity: e.payload.doc.data().quantity
        }
      })
    })
  }

  delete(item: any): void{
    this.firebaseServiceService.deleteProductCart(item)
    this.ngOnInit()
  }

  update(id: any, product_key: any, nombre, descripcion, codigo, precio, impuesto, stock){
    if(!(id === null || id === undefined)){
      this.productCartForm.patchValue({
        nombre: nombre,
        descripcion: descripcion,
        codigo: codigo,
        precio: precio,
        impuesto: impuesto,
        stock: stock,
        product_key: product_key,
        cart_key: 1
      });
      this.firebaseServiceService.updateProductCart(id, this.productCartForm.value).then(res=>{
        this.current_product_card = new ProductoCart()
        this.ngOnInit()
      })
    }
  }

  updateCard(id){
    /**this.current_card.id = id
    this.current_card.status = "completed" // solo puede cambiarse a completed
    this.service2.update(this.current_card).subscribe(res=>{
      this.ngOnInit()
    })**/
  }

}