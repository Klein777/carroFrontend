import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto'
import { ProductoCart } from '../producto-cart'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseServiceService } from '../services/firebase-service.service'

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productForm: FormGroup;
  productCartForm: FormGroup;

  current_product : Producto

  current_product_card : ProductoCart

  crud_operation = {is_new: false, is_visible: false}

  collection = {count: 0, data: []}

  q: any

  constructor(private firebaseServiceService: FirebaseServiceService, public fb: FormBuilder) {}

  trackByIndex(index: number, obj: any): any {
    return index;
  }
  

  ngOnInit(): void {

    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      impuesto: ['', Validators.required],
      stock: ['', Validators.required],
    });

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

    this.firebaseServiceService.readProducts().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          id: e.payload.doc.id,
          nombre: e.payload.doc.data().nombre,
          codigo: e.payload.doc.data().codigo,
          descripcion: e.payload.doc.data().descripcion,
          precio: e.payload.doc.data().precio,
          impuesto: e.payload.doc.data().impuesto,
          stock: e.payload.doc.data().stock
        }
      })
    })

    this.current_product = new Producto()
    this.current_product_card = new ProductoCart()

  }

  new(){
    this.current_product = new Producto()
    this.crud_operation.is_visible = true
    this.crud_operation.is_new = true
  }

  save(){
    if(this.crud_operation.is_new){
      this.firebaseServiceService.insertProduct(this.productForm.value).then(res=>{
        this.productForm.reset()
        this.current_product = new Producto()
        this.crud_operation.is_visible = false
        this.ngOnInit()
      })
    }
  }

  saveProductoCart(key, nombre, descripcion, codigo, precio, impuesto, stock){
    this.productCartForm.patchValue({
      nombre: nombre,
      descripcion: descripcion,
      codigo: codigo,
      precio: precio,
      impuesto: impuesto,
      stock: stock,
      product_key: key,
      cart_key: 1
    });
    this.firebaseServiceService.insertProductCart(this.productCartForm.value).then(res=>{
      this.productCartForm.reset()
      this.current_product = new Producto()
      this.crud_operation.is_visible = false
      this.ngOnInit()
    })
  }

}
//https://www.youtube.com/watch?v=lDy6kdD7EmU