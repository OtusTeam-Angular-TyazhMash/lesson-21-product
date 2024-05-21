import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {Product} from "./product.type";
import {ProductsResponseType} from "./products-response.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private readonly httpClient: HttpClient) { }

  getProducts(search: string): Observable<ProductsResponseType> {
    return this.httpClient.get<ProductsResponseType>(
        `https://dummyjson.com/products/search?q=${search}&delay=1000`)
  }
}
