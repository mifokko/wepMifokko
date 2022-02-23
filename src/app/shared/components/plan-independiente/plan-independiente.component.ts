import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterIndependienteComponent } from '../register-independiente/register-independiente.component';

@Component({
  selector: 'app-plan-independiente',
  templateUrl: './plan-independiente.component.html',
  styleUrls: ['./plan-independiente.component.scss']
})
export class PlanIndependienteComponent implements OnInit {

  constructor(public modalService: NgbModal, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  openRegisterIndependiente(){
    const modalRef1 = this.modalService.open(RegisterIndependienteComponent);
  }

}