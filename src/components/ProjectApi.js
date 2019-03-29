import {HttpClient} from 'aurelia-fetch-client';
/* Provides methods to return promise of data from REST Project api*/
//declare - not define
//var virtualfolderbaseurl;

export class ProjectApi {
  static inject = [HttpClient];


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
    return ProjectApi.getValue('providers', [{alias: 'test', type: 'dropbox'}, {alias: 'test2', type: 'webdav'}]);
  }

  setProviders(pr) {
    return ProjectApi.setValue('providers', pr);
  }
}
