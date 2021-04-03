import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto'
import { ProductoCart } from '../producto-cart'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseServiceService } from '../services/firebase-service.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productForm: FormGroup
  productCartForm: FormGroup
  transactionProductForm: FormGroup

  current_product : Producto

  current_product_card : ProductoCart

  p_quantity = 0
  p_stock = 0

  crud_operation = {is_new: false, is_visible: false}

  collection = {count: 0, data: []}

  tr_nombre: any
  tr_stock: any
  tr_codigo: any

  constructor(private firebaseServiceService: FirebaseServiceService, public fb: FormBuilder, private toastr: ToastrService) {}

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

    this.transactionProductForm = this.fb.group({
      tipo: ['', Validators.required],
      nombre: ['', Validators.required],
      stock: ['', Validators.required],
      codigo: ['', Validators.required],
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
        this.toastr.success('Producto creado con exito')
      })
      this.saveTr()
    }
  }

  saveTr(){
    this.transactionProductForm.patchValue({
      tipo: "entrada",
      nombre: this.tr_nombre,
      codigo: this.tr_codigo,
      stock: this.tr_stock
    });
    this.firebaseServiceService.insertProductTr(this.transactionProductForm.value).then(res=>{
      this.transactionProductForm.reset()
    })
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
      this.updateStockOfProduct(key, stock, nombre, descripcion, codigo, precio, impuesto)
      this.productCartForm.reset()
      this.current_product = new Producto()
      this.crud_operation.is_visible = false
      this.ngOnInit()
      this.toastr.success('Producto agregado al carrito')
    })
  }

  updateStockOfProduct(id: any, stock, nombre, descripcion, codigo, precio, impuesto){
    if(!(id === null || id === undefined)){

      this.p_quantity = Number(this.productCartForm.value["quantity"])//numero que escribe el usuario
      this.p_stock = Number(stock)//numero del articulo

      this.p_stock = this.p_stock - this.p_quantity//numero que queda

      this.productForm.patchValue({
        nombre: nombre,
        descripcion: descripcion,
        codigo: codigo,
        precio: precio,
        impuesto: impuesto,
        stock: this.p_stock
      })
      this.firebaseServiceService.updateProductStock(id, this.productForm.value).then(res=>{
        this.current_product_card = new ProductoCart()
        this.ngOnInit()
      })
    }
  }

}
//https://www.youtube.com/watch?v=lDy6kdD7EmU