/**
 * Created by Tomas Kulhanek on 2/17/17.
 */

import * as CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';

import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Editfile, Viewcontent} from './messages';
import {bindable} from 'aurelia-framework';
import {ProjectApi} from './ProjectApi';
import {inject} from 'aurelia-framework';

@inject(ProjectApi, EventAggregator, HttpClient)
export class Filedetail {
  @bindable pid;

  constructor(pa, ea, httpclient) {
    this.ea = ea;
    this.client = httpclient;
    this.pa = pa;
    this.ea.subscribe(Editfile, msg => this.selectFile(msg.file));
    this.ea.subscribe(Viewcontent, msg => this.viewContent(msg.content));
    this.isimage = false;
    this.filename = '';
    this.showtable = false;
  }

  attached() {
    console.log('Fileeditor.attached()1');
    this.codemirror = CodeMirror.fromTextArea(this.cmTextarea, {
      lineNumbers: true,
      mode: 'text/x-less',
      lineWrapping: true
    });
    this.codemirror.refresh();
    //sample data ofr table
    this.data = [['no data for preview', 1], [1, 1]];
  }

  selectFile(file) {
    let that = this;

    this.imageurl = file.webdavurl;
    //visualizeimg is set & image extension is detected
    //vfstorage returns string - should convert to boolean
    this.isimage =
        ((file.name.endsWith('.JPG')) ||
          (file.name.endsWith('.jpg')) ||
          (file.name.endsWith('.PNG')) ||
          (file.name.endsWith('.png')) ||
          (file.name.endsWith('.GIF')) ||
          (file.name.endsWith('.gif')) ||
          (file.name.endsWith('.BMP')) ||
          (file.name.endsWith('.bmp')) ||
          (file.name.endsWith('.SVG')) ||
          (file.name.endsWith('.svg')));

    //console.log("fileeditor.selectfile() visualizeimg: isimage:")
    //console.log(this.isimage);

    /*get first 4 kB of data, if it is supported by web server in Range header */
    if (!this.isimage) {
      this.client.fetch(file.webdavurl, {credentials: 'same-origin', headers: {'Range': 'bytes=0-4095'}})
        .then(response => {
          that.codemirror.setValue(data);
          that.codemirror.refresh();
          that.filename = file.webdavurl;
        }
        ).catch(error => {
          alert('Error retrieving content from ' + file.webdavurl);
          console.log(error);
        });
    }
  }

  viewContent(content) {
    //console.log("viewContent",content);
    this.codemirror.setValue(JSON.stringify(content, null, 4));
    this.codemirror.refresh();
  }

}
