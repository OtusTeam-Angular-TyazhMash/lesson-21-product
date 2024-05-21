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
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements AfterViewInit, DoCheck {
  refreshNotified$ = new Subject()
  titles$: Observable<string[]> | null = null;
  search = new FormControl<string | null>(null);

  constructor(private readonly productService: ProductService) {
  }

  ngAfterViewInit() {

    this.titles$ = this.search.valueChanges
      .pipe(
        distinctUntilChanged(),
        combineLatestWith(this.refreshNotified$.pipe(startWith(undefined))),
        debounceTime(500),
        map(([search, _]) => search),
        switchMap(search =>
           search
             ? this.productService.getProducts(search)
               .pipe(
                 map(item => item.products.map(product => product.title)))
             : of([]))
      )
  }

  ngDoCheck(): void {
    console.log('ReactiveComponent => ngDoCheck()')
  }

  onRefreshClick() {
    this.refreshNotified$.next(undefined)
  }
}
