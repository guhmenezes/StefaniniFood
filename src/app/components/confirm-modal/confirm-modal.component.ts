import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {

  @Input() msg:any;
  @Input() title:any;
  @Input() cancelBtn:any;
  @Input() okBtn:any;

	constructor(public modal: NgbActiveModal) {}

}