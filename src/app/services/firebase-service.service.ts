import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {


  constructor(private firestore: AngularFirestore) {
   }

  readProducts(){
    return this.firestore.collection("products").snapshotChanges()
  }
  insertProduct(product: any){
    return this.firestore.collection("products").add(product)
  }

  insertProductTr(transaction: any){
    return this.firestore.collection("transactions_products").add(transaction)
  }

  insertFacturaTr(factura: any){
    return this.firestore.collection("facturas").add(factura)
  }

  readProductCart(){
    return this.firestore.collection("product_cart").snapshotChanges()
  }

  /**readProductByKey(id: any){

    return this.firestore.doc("products/"+id+"/nombre").get()
  }**/

  insertProductCart(product_cart: any){
    return this.firestore.collection("product_cart").add(product_cart)
  }
  updateProductCart(id: any, product_cart: any){
    return this.firestore.collection("product_cart").doc(id).update(product_cart)
  }
  deleteProductCart(id: any){
    return this.firestore.collection("product_cart").doc(id).delete()
  }

  updateProductStock(id: any, product: any){
    return this.firestore.collection("products").doc(id).update(product)
  }

}
