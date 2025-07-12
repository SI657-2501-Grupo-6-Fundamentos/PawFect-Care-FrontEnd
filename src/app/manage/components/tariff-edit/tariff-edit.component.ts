import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {Tariff} from "../../model/tariff.entity";
import {TariffService} from "../../services/tariff.service";
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tariff-edit',
  templateUrl: './tariff-edit.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./tariff-edit.component.css']
})
export class TariffEditComponent implements OnInit {
  @Input() tariffData!: Tariff;
  @Output() tariffUpdated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  tariffForm!: FormGroup;

  serviceNames = [
    'GENERAL_MEDICINE',
    'VETERINARY_SURGERY',
    'VETERINARY_PATHOLOGY',
    'VETERINARY_RADIOLOGY',
    'VETERINARY_NUTRITION',
    'VETERINARY_BEHAVIOR',
    'VETERINARY_OPHTHALMOLOGY',
    'VETERINARY_DERMATOLOGY',
    'VETERINARY_CARDIOLOGY',
    'VETERINARY_ONCOLOGY',
    'VETERINARY_NEUROLOGY',
    'VETERINARY_ORTHOPEDICS',
    'VETERINARY_PHYSIOTHERAPY',
    'EMERGENCY_AND_CRITICAL_CARE',
  ];

  constructor(private fb: FormBuilder, private tariffService: TariffService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tariffService.getById(id).subscribe({
        next: (tariff) => {
          this.tariffData = tariff;
          this.initializeForm();
        },
        error: (err) => {
          console.error('Error al cargar tarifa', err);
          this.router.navigate(['/manage/tariffs']);
        }
      });
    } else {
      console.error('ID de tarifa no proporcionado en la ruta');
      this.router.navigate(['/manage/tariffs']);
    }
  }

  initializeForm(): void {
    this.tariffForm = this.fb.group(
      {
        serviceName: [this.tariffData?.serviceName || '', Validators.required],
        cost: [this.tariffData?.cost || 0, [Validators.required, Validators.min(0)]],
        minimumCost: [this.tariffData?.minimumCost || 0, [Validators.required, Validators.min(0)]],
        maximumCost: [this.tariffData?.maximumCost || 0, [Validators.required, Validators.min(0)]],
      },
      { validators: this.validateCostRange }
    );
  }


  validateCostRange(group: FormGroup) {
    const min = group.get('minimumCost')?.value;
    const cost = group.get('cost')?.value;
    const max = group.get('maximumCost')?.value;

    if (min != null && cost != null && max != null) {
      return min <= cost && cost <= max ? null : { costRangeInvalid: true };
    }
    return null;
  }

  getFormattedServiceName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  onSubmit() {
    if (this.tariffForm.valid && this.tariffData) {
      const updatedTariff = {
        id: this.tariffData.id,
        ...this.tariffForm.value
      };

      this.tariffService.update(updatedTariff.id, updatedTariff).subscribe({
        next: () => {
          console.log('Tarifa actualizada');
          this.tariffUpdated.emit();
          this.router.navigate(['/manage/tariffs']);
        },
        error: (err) => console.error('Error al actualizar tarifa', err)
      });
    } else {
      this.tariffForm.markAllAsTouched();
      if (!this.tariffData) {
        console.error('tariffData no ha sido definido');
      }
    }
  }

  get isCostRangeInvalid(): boolean {
    return !!this.tariffForm.errors?.['costRangeInvalid']
      && (this.tariffForm.dirty || this.tariffForm.touched);
  }

  cancel() {
    this.router.navigate(['/manage/tariffs']);
  }
}
