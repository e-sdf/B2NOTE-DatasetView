import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Editfile, Webdavresource} from './messages';
import {ProjectApi} from '../components/ProjectApi';
import {inject} from 'aurelia-framework';

@inject(ProjectApi, EventAggregator, HttpClient)
export class Filelist {
//  static inject = [EventAggregator, HttpClient];

  constructor(pa, ea, httpclient) {
    //even aggregator to listen for webdav resource to be presented/updated in panel
    this.pa = pa;
    this.ea = ea;
    this.ea.subscribe(Webdavresource, msg =>this.setwebdav(msg.webdavurl));
    //http client to perform WEBDAV queries
    this.httpclient = httpclient;
    this.httpclient.configure(config => {
      config
        .rejectErrorResponses()
        .withBaseUrl('')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        });
    });
    this.webdavpath = '';///files/XufWqKau/';
    this.auth = false;
    //hold depth of directory structure if cd into them
  }

  attached() {
    this.root();
  }

  root() {
    let providers = this.pa.getProviders();
    this.dirs = [];
    this.files = [];
    for (let provider of providers) {
      let item = {};
      item.name = provider.alias;
      item.nicename = provider.alias;
      item.nicesize = 'DIR (' + provider.type + ')';
      item.nicedate = '';
      item.isdir = true;
      item.isprovider = true;
      /*let prefix = provider.endpoint.slice(0, 8);
      let username = provider.username.replace('@', '%40');
      let suffix = provider.endpoint.slice(8);
      item.url = prefix + username + ':' + provider.usersecure + '@' + suffix;*/
      item.url = provider.endpoint;
      item.auth = btoa(provider.username + ':' + provider.usersecure);
      this.files.push(item);
    }
  }

  setwebdav(webdavurl, auth) {
    console.log('setwebdav() obtained url:' + webdavurl);
    this.webdavpath = webdavurl;
    if (!webdavurl) {this.files = []; return;}
    //query the directory content
    let headers = auth ? {'Depth': '1', 'Authorization': 'Basic ' + auth} : {'Depth': '1'};
    this.httpclient.fetch(this.webdavpath, {
      method: 'PROPFIND',
      headers: headers
    }).then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then(data => {
        //parse structure https://stackoverflow.com/questions/17604071/parse-xml-using-javascript
        this.files = [];
        let tempfiles = [];
        let tempdirs = [];
        let filesDOM = data.getElementsByTagNameNS('DAV:', 'response');
        console.log(data);
        for (let fileitem of filesDOM) {
          console.log(fileitem);
          let fileurl = this.getFirstElementByTagNameNS(fileitem, 'DAV:', 'href');
          let filename = this.lastContextName(fileurl);
          let filedate = this.getFirstElementByTagNameNS(fileitem, 'DAV:', 'creationdate');
          let filesize = this.getFirstElementByTagNameNS(fileitem, 'DAV:', 'getcontentlength');
          let filetype = this.getContentType(fileitem);//FirstElementByTagNameNS(fileitem, 'DAV:', 'getcontenttype');
          //let contenttype = this.getContentType(fileitem);//FirstElementByTagNameNS(fileitem, 'DAV:', 'resourcetype');
          console.log(this.webdavpath + ' x ' + filename);

          let item = {};
          item.name = filename;//.replace(this.webdavpath, ''); //replaces the prefix
          item.nicename = this.formatName(filename);//
          item.date = filedate;
          item.nicedate = this.formatDate(new Date(filedate));
          item.isdir = filetype === 'httpd/unix-directory' || filetype === 'collection';
          item.size = filetype === 'httpd/unix-directory' || filetype === 'collection' ? 'DIR' : filesize;
          //convert to 4GB or 30MB or 20kB or 100b
          if (item.isdir) {
            item.nicesize = item.size;
          } else {
            if (~~(item.size / 1000000000) > 0) {
              item.nicesize = ~~(item.size / 1000000000) + 'GB';
            } else {
              if (~~(item.size / 1000000) > 0) {
                item.nicesize = ~~(item.size / 1000000) + 'MB';
              } else {
                item.nicesize = ~~(item.size / 1000) > 0 ? ~~(item.size / 1000) + 'kB' : item.size + ' b';
              }
            }

            item.type = filetype;
            item.webdavurl = this.webdavpath + item.name;
            //directory first, files after that
          }
          //console.log('adding item');
          //console.log(item);
          //if (fileurl === this.webdavpath) item.name = '..'; //first item might be the current dir
          if (item.isdir) tempdirs.push(item);//this.files.unshift(item);
          else tempfiles.push(item);//this.files.push(item);
        }
        //adds first row with '..' to cd to parent directory
        //if (this.dirs.length > 0)
        //ignore first dir - as it is self
        tempdirs.shift();//this.files.shift(); //first is self
        //concat dirs first, files last
        //console.log('dirs and files:',tempdirs,tempfiles);
        this.files = tempdirs.concat(tempfiles);
        //add first .. to be able to cd up
        this.files.unshift({name: '..', nicename: '..', isdir: true, nicesize: 'DIR', date: ''});
      }).catch(error => {
        this.files = [];
        console.log('setwebdav() error');
        console.log(error);
      });
  }

  getFirstElementByTagName(fileitem, tag) {
    //console.log(tag);
    let elements = fileitem.getElementsByTagName(tag);
    //console.log(elements);
    return elements.length > 0 ? elements[0].textContent : '';
  }

  getFirstElementByTagNameNS(fileitem, ns, tag) {
    //console.log(tag);
    let elements = fileitem.getElementsByTagNameNS(ns, tag);
    //console.log(elements);
    return elements.length > 0 ? elements[0].textContent : '';
  }

  getContentType(fileitem) {
    //[0].firstChild.localName
    let rt = fileitem.getElementsByTagNameNS('DAV:', 'resourcetype');
    if (rt.length > 0 && rt[0].firstChild ) return rt[0].firstChild.localName;
    return this.getFirstElementByTagNameNS(fileitem, 'DAV:', 'getcontenttype');
  }

  lastContextName(str) {
    let str2 = str.endsWith('/') ? str.slice(0, str.lastIndexOf('/')) : str;
    let sli = str2.lastIndexOf('/');
    return sli >= 0 ? str.slice(sli) : str; //keep last slash
  }

  formatName(fn) {
    let filename = fn.replace(/%20/g, ' ');

    return filename.startsWith('/') ? filename.slice(1) : filename;
  }

  selectFile(file) {
    //file.webdavurl = this.webdavpath+file.name;
    if (file.isprovider) {
      this.auth = file.auth;
      this.setwebdav(file.url, file.auth);
    } else
    if (file.isdir) {
      let newdir = '';
      if (file.name === '..') {
        if (this.dirs.length === 0) { this.root(); return; } //going from current storage
        newdir = this.dirs.pop(); //going up inside storage
      } else {
        this.dirs.push(this.webdavpath);
        newdir = this.webdavpath + file.name;
      }
      this.setwebdav(newdir, this.auth);
    } else { file.auth = this.auth; this.ea.publish(new Editfile(file)); }
  }

  formatDate(date) {
    let diff = new Date() - date; // the difference in milliseconds

    if (diff < 1000) { // less than 1 second
      return 'right now';
    }

    let sec = Math.floor(diff / 1000); // convert diff to seconds

    if (sec < 60) {
      return sec + ' sec. ago';
    }

    let min = Math.floor(diff / 60000); // convert diff to minutes
    if (min < 60) {
      return min + ' min. ago';
    }

    // format the date
    // add leading zeroes to single-digit day/month/hours/minutes
    let d = date;
    d = [
      '0' + d.getDate(),
      '0' + (d.getMonth() + 1),
      '' + d.getFullYear(),
      '0' + d.getHours(),
      '0' + d.getMinutes()
    ].map(component => component.slice(-2)); // take last 2 digits of every component

    // join the components into date
    return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
  }

  viewMetadata(file) {
    //not implemented in backend
  }
}
