import {AfterViewInit, Component, DoCheck, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  combineLatest, combineLatestWith,
  debounceTime,
  distinctUntilChanged, filter,
  fromEvent,
  map, mergeMap,
  Observable, of,
  startWith,
  Subject,
  switchMap
} from "rxjs";
import {ProductService} from "../../services/product.service";
import {fromPromise} from "rxjs/internal/observable/innerFrom";


@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements AfterViewInit, DoCheck {
  refreshNotified$ = new Subject()

  titles$: Observable<string[]> | null = null;
  @ViewChild('search')
  searchInputElement: ElementRef<HTMLInputElement> | null = null;

  @ViewChild("refresh")
  refreshButtonElement: ElementRef<HTMLButtonElement> | null = null;


  constructor(private readonly productService: ProductService) {
  }

  ngAfterViewInit() {

    this.titles$ = fromEvent(this.searchInputElement!.nativeElement, 'input')
      .pipe(
        map(e => {
          const {value} = e.target as HTMLInputElement
          return value
        }),
        distinctUntilChanged(),
        debounceTime(500),
        combineLatestWith(this.refreshNotified$.pipe(startWith(undefined))),
        map(([search, _]) => search),
        switchMap(search =>
           Boolean(search)
             ? this.productService.getProducts(search)
               .pipe(
                 map(item => item.products.map(product => product.title)))
             : of([]))
      )

    this.refreshButtonElement?.nativeElement.addEventListener('click', () => {
      this.refreshNotified$.next(undefined)
    })
  }

  ngDoCheck(): void {
    console.log('ReactiveComponent => ngDoCheck()')
  }
}
