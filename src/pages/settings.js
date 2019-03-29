import {inject} from 'aurelia-framework';
import {ProjectApi} from '../components/ProjectApi';

@inject(ProjectApi)
export class Settings {
  constructor(pa) {
    this.pa = pa;
  }
  activate() {
    this.providers = this.pa.getProviders();
  }
}
