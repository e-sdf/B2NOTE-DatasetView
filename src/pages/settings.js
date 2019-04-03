import {inject} from 'aurelia-framework';
import {ProjectApi} from '../components/ProjectApi';

@inject(ProjectApi)
export class Settings {
  constructor(pa) {
    this.pa = pa;
    this.b2noteurl = '/api';
    this.adding = false;
    this.supportedproviders = ['B2Drop', 'Dropbox', 'WEBDAV'];
    this.addname = this.addtype = this.addendpoint = this.addusername = this.addusersecure = '';
  }
  activate() {
    this.providers = this.pa.getProviders();
    this.b2noteurl = this.pa.getB2noteurl();
  }
  submit() {
    this.pa.setB2noteurl(this.b2noteurl);
  }

  addProvider() {
    let pr = {};
    pr.alias = this.addname;
    pr.type = this.addtype;
    pr.endpoint = this.addendpoint;
    pr.username = this.addusername;
    pr.usersecure = this.addusersecure;
    this.adding = false;
    this.providers.push(pr);
    this.pa.addProvider(pr);
    this.pa.setProviders(this.providers);
  }
  addingProvider() {
    this.adding = true;
  }

  removeProvider(pr) {
    let pri = this.providers.indexOf(pr);
    if (pri > -1) {
      //remove
      this.providers.splice(pri, 1);
    }
    this.pa.removeProvider(pr);
    this.pa.setProviders(this.providers);
  }
}
