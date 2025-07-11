import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DiagnosticService} from "../../services/diagnostic.service";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-diagnostic-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './diagnostic-create.component.html',
  styleUrl: './diagnostic-create.component.css'
})
export class DiagnosticCreateComponent {
  @Output() diagnosticCreated = new EventEmitter<void>();
  diagnosticForm: FormGroup;

  diagnosticTypes = [
    'GENERAL_MEDICINE',
    'VETERINARY_SURGERY',
    'VETERINARY_PATHOLOGY',
    'VETERINARY_RADIOLOGY',
    'VETERINARY_NUTRITION',
    'VETERINARY_BEHAVIOR',
    'EMERGENCY_AND_CRITICAL_CARE'
  ];

  constructor(private fb: FormBuilder, private diagnosticService: DiagnosticService, private router: Router) {
    this.diagnosticForm = this.fb.group({
      diagnosticDate: ['', Validators.required],
      diagnosticDescription: ['', Validators.required],
      diagnosticType: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.diagnosticForm.valid) {
      const diagnostic = this.diagnosticForm.value;

      this.diagnosticService.create(diagnostic).subscribe({
        next: () => {
          console.log('Diagnóstico creado con éxito');
          this.diagnosticCreated.emit();
          this.diagnosticForm.reset();
          this.router.navigate(['/manage/diagnostics']);
        },
        error: (error) => {
          console.error('Error al crear diagnóstico', error);
        }
      });
    } else {
      this.diagnosticForm.markAllAsTouched();
    }
  }

  getFormattedDiagnosticName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  cancel(): void {
    this.router.navigate(['/manage/diagnostics']);
  }
}
