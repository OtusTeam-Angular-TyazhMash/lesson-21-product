import {Product} from "./product.type";

export type ProductsResponseType = {
  products: Product[]
  total: number
  skip: number
  limit: number
}
