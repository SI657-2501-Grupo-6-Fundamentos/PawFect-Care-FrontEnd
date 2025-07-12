import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Diagnostic} from "../../model/diagnostic.entity";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DiagnosticService} from "../../services/diagnostic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-diagnostic-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
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

  constructor(private fb: FormBuilder, private diagnosticService: DiagnosticService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.diagnosticService.getById(id).subscribe({
        next: (diagnostic) => {
          this.diagnosticData = diagnostic;
          this.initializeForm();
        },
        error: (err) => {
          console.error('Error al cargar diagnóstico', err);
          this.router.navigate(['/manage/diagnostics']);
        }
      });
    } else if (this.diagnosticData) {
      this.initializeForm();
    } else {
      console.error('No se proporcionó un ID de diagnóstico');
      this.router.navigate(['/manage/diagnostics']);
    }
  }

  initializeForm() {
    if (!this.diagnosticData) {
      console.error('No hay datos de diagnóstico para inicializar el formulario');
      return;
    }

    // Formatear la fecha para el input date
    const formattedDate = this.diagnosticData.diagnosticDate ?
      this.formatLocalISO(this.diagnosticData.diagnosticDate) : '';

    this.diagnosticForm = this.fb.group({
      diagnosticDate: [formattedDate, [Validators.required]],
      description: [this.diagnosticData.description, [Validators.required]],
      diagnosticSpecialty: [this.diagnosticData.diagnosticSpecialty, [Validators.required]]
    });
    // ✅ Removido el validador de fecha para permitir actualizaciones
  }

  formatLocalISO(date: string | Date): string {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 10);
  }

  // ✅ Función para convertir fecha a LocalDateTime format
  formatDateTimeForBackend(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString(); // Formato ISO que Java puede parsear
  }

  getFormattedDiagnosticName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  onSubmit() {
    if (this.diagnosticForm.valid && this.diagnosticData) {
      const formValue = this.diagnosticForm.value;

      // ✅ Preparar datos con formato correcto para el backend
      const updatedDiagnostic = {
        id: this.diagnosticData.id,
        diagnosticDate: this.formatDateTimeForBackend(formValue.diagnosticDate),
        description: formValue.description,
        diagnosticSpecialty: formValue.diagnosticSpecialty
      };

      console.log('Datos enviados al backend:', updatedDiagnostic); // Debug

      this.diagnosticService.update(updatedDiagnostic.id, updatedDiagnostic).subscribe({
        next: (response) => {
          console.log('Diagnóstico actualizado con éxito', response);
          this.diagnosticUpdated.emit();
          this.router.navigate(['/manage/diagnostics']);
        },
        error: (err) => {
          console.error('Error al actualizar el diagnóstico', err);
          console.error('Status:', err.status);
          console.error('Message:', err.message);
          console.error('Response:', err.error);
        },
      });
    } else {
      console.log('Formulario inválido:', this.diagnosticForm.errors);
      this.diagnosticForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/manage/diagnostics']);
  }
}
