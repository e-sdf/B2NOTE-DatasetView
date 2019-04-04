import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {Viewanno} from './messages';

@inject(EventAggregator)

export class Annodetail {
  constructor(ea) {
    this.ea = ea;
    this.items = [{name: '2M6Z.pdb', size: '4 Mb', date: 'Tue, 02 Apr 2019 13:19:23 GMT', preview: 'HEADER    OXYGEN TRANSPORT                        15-APR-13   2M6Z'},
      {name: '2M6A.pdb', size: '42 Mb', date: 'Mon, 01 Apr 2019 11:14:00 GMT', preview: 'HEADER    OXYGEN TRANSPORT                        15-APR-13   2M6A'}];
    this.myitems = [
      [{name: '2M6Z.pdb', size: '4 Mb', date: 'Tue, 02 Apr 2019 13:19:23 GMT', preview: 'HEADER    OXYGEN TRANSPORT                        15-APR-13   2M6Z'},
        {name: '2M6A.pdb', size: '42 Mb', date: 'Mon, 01 Apr 2019 11:14:00 GMT', preview: 'HEADER    OXYGEN TRANSPORT                        15-APR-13   2M6A'}],
      [{name: '2HHD.pdb', size: '4 Mb', date: 'Tue, 02 Apr 2019 13:19:23 GMT', preview: 'HEADER    OXYGEN TRANSPORT                        15-APR-13   2M6Z'},
        {name: '4HHY.pdb', size: '42 Mb', date: 'Mon, 01 Apr 2019 11:14:00 GMT', preview: 'HEADER    '},
        {name: '4H5N.pdb', size: '31 Mb', date: 'Wed, 06 Mar 2001 08:14:00 GMT', preview: 'HEADER    '},
        {name: '4H6Z.pdb', size: '26 Mb', date: 'Mon, 23 Aug 1998 14:14:00 GMT', preview: 'HEADER    '},
        {name: '6ND1.pdb', size: '78 Mb', date: 'Fri, 21 May 2005 18:14:00 GMT', preview: 'HEADER    '},
        {name: '6EHD.pdb', size: '22 Mb', date: 'Mon, 03 Jan 2007 11:14:00 GMT', preview: 'HEADER    '}],
      [{name: '73EH.pdb', size: '4 Mb', date: 'Tue, 02 Apr 2019 13:19:23 GMT', preview: 'HEADER    '},
        {name: '73EH.mmcif', size: '142 Mb', date: 'Mon, 01 Apr 2019 11:14:00 GMT', preview: 'mmcif'}]
    ];
    this.ea.subscribe(Viewanno, msg => this.viewAnno(msg.anno));
  }

  viewAnno(an) {
    this.items = this.myitems[an.id];
  }
}
