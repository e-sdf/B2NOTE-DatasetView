import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
/* Provides methods to return promise of data from REST Project api*/
//declare - not define
//var virtualfolderbaseurl;
@inject(HttpClient)
export class ProjectApi {

  constructor(httpclient) {
    this.httpclient = httpclient;
    this.httpclient.configure(config => {
      config
        .rejectErrorResponses()
        .withBaseUrl('')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json'
          }
          //          'X-Requested-With': 'Fetch'
          // }
        });
    });
  }
  /**gets value, if storage is not supported by browser then default value string "true"
   *
   * @param propertyName
   * @param defaultvalue
   * @returns {string}
   */
  static getValue(propertyName, defaultvalue = 'true') {
    return (typeof(Storage) !== 'undefined') ?
      (localStorage.getItem(propertyName) ?
        localStorage.getItem(propertyName) : defaultvalue) : defaultvalue;
  }
  /** sets value to the property into localStorage,
   * if not supported by browser, does nothing
   *
   * @param propertyName
   * @param value
   * @returns {*}
   */
  static setValue(propertyName, value) {
    return (typeof(Storage) !== 'undefined') ? localStorage.setItem(propertyName, value) : value;
  }

  getProviders() {
    return JSON.parse(ProjectApi.getValue('providers', '[]'));
  }

  setProviders(pr) {
    return ProjectApi.setValue('providers', JSON.stringify(pr));
  }

  getB2noteurl() {
    return ProjectApi.getValue('b2noteurl', '/api');
  }

  setB2noteurl(url) {
    return ProjectApi.setValue('b2noteurl', url);
  }


  addProvider(pr) {
  }
  removeProvider(pr) {
  }

  getB2NoteAnnotations() {
    let b2noteurl = this.getB2noteurl();
    return this.httpclient.fetch(b2noteurl + '/annotations')
      .then(response => response.json())
      .then(annotations => {return annotations;})
      .catch(error =>{
        console.log("fetch on '" + b2noteurl + "' returned error:", error);
        throw error;
      });
  }
}
