import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  columns: Array<any>;
  page: number;
  itemsPerPage: number;
  maxSize: number;
  numPages: number;
  length: number;
  config: any;
  filterString: string;
  data: Observable<any>;
  rows: Observable<any>;

  constructor(private http: HttpClient) {
    this.columns = [
      { title: 'Sku', name: 'sku' },
      { title: 'Name', name: 'name' },
      { title: 'Details', name: 'details' },
      { title: 'Informations', name: 'informations' },
      { title: 'Tags', name: 'tags' },
      { title: 'Price', name: 'price' },
      { title: 'Sizes', name: 'sizes' },
    ];
    this.page = 1;
    this.itemsPerPage = 10;
    this.maxSize = 5;
    this.numPages = 1;
    this.length = 0;
    this.config = {
      paging: true,
      sorting: { columns: this.columns },
      filtering: { filterString: '' },
      className: ['table-striped', 'table-bordered']
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData() {

    let endpoint: string = environment.endpointAPI;
    endpoint = this.filterString ? `${endpoint}?search=${this.filterString}` : endpoint;
    endpoint = this.page ? `${endpoint}?page=${this.page}` : endpoint;

    this.data = this.http.get(endpoint);
    this.rows = this.data.pipe
      (map(data =>
        data.results.map(item => {
          item.sizes = JSON.stringify(item.sizes);
          item.informations = JSON.stringify(item.informations);
          return item;
        }))
      );

    this.data.pipe(map(data => data.count))
      .subscribe(total => this.length = total);

  }

  public onFiltering(config) {
    this.filterString = config.filtering.filterString;
    this.getData();
  }
  
  public pageChanged(event) {
    if (this.page && event.page)
      this.page = event.page;
      console.log(this.page)
      this.getData();
  }

}
