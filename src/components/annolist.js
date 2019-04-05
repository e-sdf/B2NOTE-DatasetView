import {Viewanno} from './messages';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ProjectApi} from '../components/ProjectApi';

@inject(EventAggregator, ProjectApi)
export class Annolist {
  constructor(ea, pa) {
    this.ea = ea;
    this.pa = pa;
    this.annotations = [{name: 'pdb structure (1)', type: 'free text', id: 1},
      {name: 'Oxygen transport(2)', type: 'composite  ontology(...)', id: 2}];
  }

  attached() {
    console.log('attached annolist');
    this.pa.getB2NoteAnnotations()
      .then(annotations =>{
        this.annotations = annotations['schema:itemListElement'];
        console.log('annotations', this.annotations);
      });
  }

  selectAnno(an) {
    this.ea.publish(new Viewanno(an));
  }
}
