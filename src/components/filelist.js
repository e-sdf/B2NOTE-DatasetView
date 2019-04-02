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
    //hold depth of directory structure if cd into them
  }

  attached() {
    let providers = this.pa.getProviders();
    this.dirs = [];
    this.files = [];
    for (let provider of providers) {
      let item = {};
      item.name = provider.alias;
      item.nicesize = 'DIR (' + provider.type + ')';
      item.nicedate = '';
      item.isdir = true;
      this.files.push(item);
    }
    console.log('filelist:');
    console.log(this.files);
  }

  setwebdav(webdavurl) {
    console.log('setwebdav() obtained url:' + webdavurl);
    this.webdavpath = webdavurl;
    if (!webdavurl) {this.files = []; return;}
    //query the directory content
    this.httpclient.fetch(this.webdavpath, {
      method: 'PROPFIND',
      headers: {'Depth': '1'}
    }).then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
      .then(data => {
        //parse structure https://stackoverflow.com/questions/17604071/parse-xml-using-javascript
        this.files = [];
        let filesDOM = data.getElementsByTagName('D:response');
        for (let fileitem of filesDOM) {
          let filename = this.getFirstElementByTagName(fileitem, 'D:href');
          let filedate = this.getFirstElementByTagName(fileitem, 'lp1:creationdate');
          let filesize = this.getFirstElementByTagName(fileitem, 'lp1:getcontentlength');
          let filetype = this.getFirstElementByTagName(fileitem, 'D:getcontenttype');
          //console.log(this.webdavpath+" x "+filename);
          if (filename !== this.webdavpath) { //do not include current dir
            let item = {};
            item.name = filename.replace(this.webdavpath, '');
            item.date = filedate;
            item.nicedate = this.formatdate(new Date(filedate));
            item.isdir = filetype === 'httpd/unix-directory';
            item.size = filetype === 'httpd/unix-directory' ? 'DIR' : filesize;
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
            }
            item.type = filetype;
            item.webdavurl = this.webdavpath + item.name;
            //directory first, files after that
            if (item.isdir) this.files.unshift(item);
            else this.files.push(item);
          }
        }
        //adds first row with '..' to cd to parent directory
        if (this.dirs.length > 0) this.files.unshift({name: '..', isdir: true, size: 'DIR', date: ''});
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

  selectFile(file) {
    //file.webdavurl = this.webdavpath+file.name;
    if (file.isdir) {
      let newdir = '';
      if (file.name === '..') {
        newdir = this.dirs.pop();
      } else {
        this.dirs.push(this.webdavpath);
        newdir = this.webdavpath + file.name;
      }
      this.setwebdav(newdir);
    } else  this.ea.publish(new Editfile(file));
  }

  formatdate(date) {
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
