import {Component, OnInit } from '@angular/core';
import {
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable, of,
  startWith,
  Subject,
  switchMap
} from "rxjs";
import {ProductService} from "../../services/product.service";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  refreshNotified$ = new Subject()

  titles$: Observable<string[]> | null = null;

  search = new FormControl<string | null>(null);

  constructor(private readonly productService: ProductService) {}

  ngOnInit() {
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

  onRefreshClick() {
    this.refreshNotified$.next(undefined)
  }
}
