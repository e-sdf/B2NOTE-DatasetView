import {Viewanno} from './messages';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';


@inject(EventAggregator)

export class Annolist {
  constructor(ea) {
    this.ea = ea
    this.annotations = [{name: 'pdb structure (1)', type: 'free text', id: 1},
      {name: 'Oxygen transport(2)', type: 'composite  ontology(...)', id: 2}];
  }

  selectAnno(an) {
    this.ea.publish(new Viewanno(an));
  }
}
