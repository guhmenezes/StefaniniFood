import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './alert-modal.component.html'
})
export class AlertModalComponent {
  @Input() msg:any;
  @Input() title:any;
  @Input() txtBtn:any;
  @Input() plusIcon?: boolean;

  constructor(public activeModal: NgbActiveModal) {}
}
