import {
  AfterViewInit,
  Component,
  DoCheck, ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {combineLatestWith, lastValueFrom} from "rxjs";

@Component({
  selector: 'app-imperative',
  templateUrl: './imperative.component.html',
  styleUrls: ['./imperative.component.css'],
})
export class ImperativeComponent implements DoCheck, AfterViewInit {

  titles: string[] = []

  @ViewChild('search')
  searchInputElement: ElementRef<HTMLInputElement> | null = null;

  @ViewChild("refresh")
  refreshButtonElement: ElementRef<HTMLButtonElement> | null = null;

  private lastSearch: string = ''
  private sendRequestTimeoutId: number | undefined;

  constructor(
    private readonly ngZone: NgZone,
    private readonly productService: ProductService) {}

  private getProducts(search: string) {
      lastValueFrom(this.productService.getProducts(search))
        .then(productsResponse => productsResponse.products.map(item => item.title))
        .then(titles => {

          this.ngZone.run(() => {
            this.titles = titles
          })
        })
  }

  ngAfterViewInit(): void {
    this.initSearchElement();
    this.initRefreshButtonElement();
  }

  private initSearchElement() {
    this.ngZone.runOutsideAngular(() => {
      this.searchInputElement!.nativeElement.addEventListener('input', (e: Event) => {
        const {value} = e.target as HTMLInputElement

        if (this.sendRequestTimeoutId) {
          clearTimeout(this.sendRequestTimeoutId)
        }

        this.sendRequestTimeoutId = setTimeout(() => {
          if (value === '') {
            this.ngZone.run(() => this.titles = []);
            return;
          }

          if (value !== this.lastSearch) {
            this.lastSearch = value;
            this.getProducts(value);
          }
        }, 500)
      })
    })
  }

  private initRefreshButtonElement() {
    this.ngZone.runOutsideAngular(() => {
      this.refreshButtonElement!.nativeElement.addEventListener('click', () => {
        if (this.lastSearch !== '') {
          this.ngZone.run(() => {
            this.getProducts(this.lastSearch)
          })
        }
      })
    })
  }

  ngDoCheck(): void {
    console.log('ImperativeComponent -> ngDoCheck')
  }
}
