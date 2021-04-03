import { Component, OnInit } from '@angular/core';
import { ProductoCart } from '../producto-cart'
import { Cart } from '../cart'
import { FirebaseServiceService } from '../services/firebase-service.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  current_product_card : ProductoCart
  current_card : Cart

  productCartForm: FormGroup
  facturaForm: FormGroup
  productForm: FormGroup

  transactionProductForm: FormGroup

  collection = {count: 0, data: []}

  f_impuesto = 0
  f_sub = 0
  f_total = 0
  f_numero = 0
  f_fecha: any

  p_quantity = 0
  p_stock = 0

  constructor(public firebaseServiceService: FirebaseServiceService, public fb: FormBuilder, private toastr: ToastrService) {}

  generarDatos() : void {
    
    for(let i = 0; i < this.collection.data.length; i++) {
      this.f_sub += (Number(this.collection.data[i]["precio"]) * Number(this.collection.data[i]["quantity"]))// genero el subtotal
      this.f_impuesto += (Number(this.collection.data[i]["impuesto"]) * Number(this.collection.data[i]["quantity"]))// genero el impuesto
      this.saveTr(this.collection.data[i]["nombre"], this.collection.data[i]["codigo"], this.collection.data[i]["quantity"])
      this.deleteAllPruductsFromCart(this.collection.data[i]["id"])//los elimino del carro
    }

    this.f_total = this.f_sub + this.f_impuesto// genero el total

    this.f_numero = Math.floor(Math.random() * (999999 - 100000)) + 100000// genero el numero de factura

    var today = new Date()

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    this.f_fecha = date+' '+time;// genero la fecha
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  ngOnInit(): void {

    this.transactionProductForm = this.fb.group({
      tipo: ['', Validators.required],
      nombre: ['', Validators.required],
      quantity: ['', Validators.required],
      codigo: ['', Validators.required],
    });

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

    this.facturaForm = this.fb.group({
      tipo: ['', Validators.required],
      numero_factura: ['', Validators.required],
      fecha: ['', Validators.required],
      sub_total: ['', Validators.required],
      impuesto: ['', Validators.required],
      total: ['', Validators.required],
    });

  }

  saveTr(nombre, codigo, quantity){
    this.transactionProductForm.patchValue({
      tipo: "salida",
      nombre: nombre,
      codigo: codigo,
      quantity: quantity
    });
    this.firebaseServiceService.insertProductTr(this.transactionProductForm.value).then(res=>{
      this.transactionProductForm.reset()
    })
  }

  saveFactura(){

    this.generarDatos()

    this.facturaForm.patchValue({
      tipo: "pago",
      numero_factura: this.f_numero,
      fecha: this.f_fecha,
      sub_total: this.f_sub,
      impuesto: this.f_impuesto,
      total: this.f_total
    });
    this.firebaseServiceService.insertFacturaTr(this.facturaForm.value).then(res=>{
      this.facturaForm.reset()
      this.f_sub = 0
      this.f_impuesto = 0
      this.f_total = 0
      this.ngOnInit()
      this.toastr.success('Carrito pagado con exito')
    })
  }

  deleteAllPruductsFromCart(item: any): void{
    this.firebaseServiceService.deleteProductCart(item)
  }

  delete(id: any, product_key: any, nombre, descripcion, codigo, precio, impuesto, stock): void{
    this.updateStockOfProduct(product_key, stock, nombre, descripcion, codigo, precio, impuesto)
    this.firebaseServiceService.deleteProductCart(id)
    this.ngOnInit()
    this.toastr.warning('Producto eliminado del carrito')
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
        this.toastr.success('Cantidad actualizada con exito')
      })
    }
  }

  updateStockOfProduct(id: any, stock, nombre, descripcion, codigo, precio, impuesto){
    if(!(id === null || id === undefined)){

      this.p_quantity = Number(this.productCartForm.value["quantity"])//numero que escribe el usuario
      this.p_stock = Number(stock)//numero del articulo

      this.p_stock = this.p_stock + this.p_quantity//numero que queda

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