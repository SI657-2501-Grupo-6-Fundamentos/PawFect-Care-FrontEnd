import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Diagnostic} from "../../model/diagnostic.entity";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DiagnosticService} from "../../services/diagnostic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-diagnostic-edit',
  standalone: true,
  imports: [],
  templateUrl: './diagnostic-edit.component.html',
  styleUrl: './diagnostic-edit.component.css'
})
export class DiagnosticEditComponent implements OnInit {
  @Input() diagnosticData!: Diagnostic;
  @Output() diagnosticUpdated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  diagnosticForm!: FormGroup;

  diagnosticSpecialties = [
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
    'EMERGENCY_AND_CRITICAL_CARE'
  ];

  constructor(private fb: FormBuilder, private diagnosticService: DiagnosticService, private router: Router) {}

  formatLocalISO(date: string | Date): string {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 10);
  }
  validateDiagnosticDate(group: FormGroup) {
    const diagnosticDate = group.get('diagnosticDate')?.value;
    const today = new Date();
    const formattedToday = this.formatLocalISO(today);

    if (diagnosticDate && diagnosticDate < formattedToday) {
      return { diagnosticDateInvalid: true };
    }
    return null;
  }
  ngOnInit(): void {
    this.diagnosticForm = this.fb.group(
      {
        diagnosticDate: [this.diagnosticData?.diagnosticDate || '', Validators.required],
        description: [this.diagnosticData?.description || '', Validators.required],
        diagnosticSpecialty: [this.diagnosticData?.diagnosticSpecialty || '', Validators.required],
      },
      { validators: this.validateDiagnosticDate }
    );
  }

  getFormattedDiagnosticName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  onSubmit() {
    if (this.diagnosticForm.valid) {
      const updatedDiagnostic = {
        id: this.diagnosticData?.id,
        ...this.diagnosticForm.value
      };

      this.diagnosticService.update(updatedDiagnostic.id, updatedDiagnostic).subscribe({
        next: result => {
          console.log('Diagnóstico actualizado con éxito');
          this.diagnosticUpdated.emit();
          this.router.navigate(['/manage/diagnostics']);
        },
        error: (err) => console.error('Error al actualizar el diagnóstico', err),
      });
    } else {
      this.diagnosticForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/manage/diagnostics']);
  }
}
