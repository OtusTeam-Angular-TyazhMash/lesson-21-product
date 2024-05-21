import {
  AfterViewInit,
  Component,
} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-imperative',
  templateUrl: './imperative.component.html',
  styleUrls: ['./imperative.component.css'],
})
export class ImperativeComponent {

  titles: string[] = []

  private lastSearch: string = ''
  private sendRequestTimeoutId: number | undefined;

  constructor(private readonly productService: ProductService) {}

  private getProducts(search: string) {
      lastValueFrom(this.productService.getProducts(search))
        .then(productsResponse => productsResponse.products.map(item => item.title))
        .then(titles => {
          this.titles = titles
        })
  }

  onSearchChanged(e: Event) {
    const {value} = e.target as HTMLInputElement

    if (this.sendRequestTimeoutId) {
      clearTimeout(this.sendRequestTimeoutId)
    }

    this.sendRequestTimeoutId = setTimeout(() => {
      if (value === '') {
        this.titles = [];
        this.lastSearch = value;
        return
      }
      if (value !== this.lastSearch) {
        this.lastSearch = value;
        this.getProducts(value);
      }
    }, 500)
  }

  onRefreshClicked() {
    if (this.lastSearch !== '') {
      if (this.sendRequestTimeoutId) {
        clearTimeout(this.sendRequestTimeoutId)
      }
      this.sendRequestTimeoutId = setTimeout(() => {
        this.getProducts(this.lastSearch)
      }, 500)
    }
  }
}
