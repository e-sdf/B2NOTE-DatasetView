
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Welcome {
  heading = 'B2Note Dataset View';
  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('/api/');
    });
    this.annotations = {};
    this.annotations._meta= {};
    this.annotations._meta.total="N/A";
    this.http = http;
  }

  activate() {
    return this.http.fetch('annotations')
      .then(response => response.json())
      .then(annotations => this.annotations = annotations);
  }

}

