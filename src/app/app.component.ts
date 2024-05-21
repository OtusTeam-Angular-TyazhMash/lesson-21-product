import {Component, DoCheck, NgZone, OnInit} from '@angular/core';
import {ProductService} from "./services/product.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  title = 'lesson-21';

  ngDoCheck(): void {
    console.log('AppComponent -> ngDoCheck')
  }
}
