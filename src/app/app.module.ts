import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductoComponent } from './producto/producto.component';
import { ProductoService } from './producto.service'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { CarritoComponent } from './carrito/carrito.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import {ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    MenuComponent,
    CarritoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [ProductoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
