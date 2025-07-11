import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {TariffService} from "../../services/tariff.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-tariff-create',
  templateUrl: './tariff-create.component.html',
  styleUrls: ['./tariff-create.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
  ]
})
export class TariffCreateComponent {
  @Output() tariffCreated = new EventEmitter<void>();
  tariffForm: FormGroup;

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

  constructor(private fb: FormBuilder, private tariffService: TariffService, private router: Router) {
    this.tariffForm = this.fb.group({
      serviceName: ['', Validators.required],
      cost: [0, [Validators.required, Validators.min(0)]],
      minimumCost: [0, [Validators.required, Validators.min(0)]],
      maximumCost: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.tariffForm.valid) {
      const tariff = this.tariffForm.value;

      this.tariffService.create(tariff).subscribe({
        next: () => {
          console.log('Tarifa creada con éxito');
          this.tariffCreated.emit();  // <- Emite para que el padre recargue
          this.tariffForm.reset();
          this.router.navigate(['/manage/tariffs']);
        },
        error: (error) => {
          console.error('Error al crear tarifa', error);
        }
      });
    } else {
      this.tariffForm.markAllAsTouched();
    }
  }

  getFormattedServiceName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  cancel(): void {
    this.router.navigate(['/manage/tariffs']);
  }
}
