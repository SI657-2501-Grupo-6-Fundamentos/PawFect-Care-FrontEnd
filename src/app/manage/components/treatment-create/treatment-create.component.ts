import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {Treatment} from "../../model/treatment.entity";
import {TreatmentService} from "../../services/treatment.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-treatment-create',
  standalone: true,
  imports: [],
  templateUrl: './treatment-create.component.html',
  styleUrl: './treatment-create.component.css'
})
export class TreatmentCreateComponent implements OnInit {

  options: Treatment[] = [];

  @Input() treatment!: Treatment;

  @ViewChild('treatmentForm', { static: false }) protected treatmentForm!: NgForm;

  constructor(private treatmentService: TreatmentService, private router: Router) {
    this.treatment=new Treatment({});
  }

  ngOnInit(): void {
    this.getAllTreatments();
  }

  getAllTreatments() {
    this.treatmentService.getAll().subscribe((response: Array<Treatment>) => {
      this.options = response;
    });
  }

  private resetEditState() {
    this.treatmentForm.reset();
  }

  private isValid(): boolean {
    if (this.treatmentForm.valid) {}
  }
}
