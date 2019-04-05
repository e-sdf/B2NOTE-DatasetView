
import {inject} from 'aurelia-framework';
import {ProjectApi} from '../components/ProjectApi';
@inject(ProjectApi)
export class Welcome {
  heading = 'B2Note Dataset View';
  constructor(pa) {
    this.annotations = {};
    this.annotations._meta = {};
    this.annotations._meta.total = 'N/A';
    this.pa = pa;
  }

  activate() {
    this.pa.getB2NoteAnnotations()
      .then(annotations => this.annotations = annotations)
      .catch(error => {
        //this.files = [];
        console.log('welcome - fetch annotations error');
        console.log(error);
      });
  }
}

