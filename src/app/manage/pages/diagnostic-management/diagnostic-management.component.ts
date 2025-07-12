import {Component, OnInit} from '@angular/core';
import {Diagnostic, DiagnosticSpecialty} from "../../model/diagnostic.entity";
import {DiagnosticService} from "../../services/diagnostic.service";
import {Router} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-diagnostic-management',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    FormsModule
  ],
  templateUrl: './diagnostic-management.component.html',
  styleUrl: './diagnostic-management.component.css'
})
export class DiagnosticManagementComponent implements OnInit {
  diagnostics: Diagnostic[] = [];
  filteredDiagnostics: Diagnostic[] = [];
  searchTerm: string = '';
  selectedSpecialty: string = '';

  constructor(private diagnosticService: DiagnosticService, private router: Router) {}

  ngOnInit(): void {
    this.loadDiagnostics();
  }

  loadDiagnostics(): void {
    this.diagnosticService.getAll().subscribe({
      next: (data) => {
        this.diagnostics = data;
        this.filteredDiagnostics = data;
      },
      error: (err) => console.error('Error loading diagnostics', err)
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSpecialtyChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredDiagnostics = this.diagnostics.filter(diagnostic => {
      const matchesSearch = this.searchTerm === '' ||
        diagnostic.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getFormattedSpecialtyName(diagnostic.diagnosticSpecialty).toLowerCase().includes(this.searchTerm.toLowerCase());

      // FIX: Comparar correctamente los valores del enum
      const matchesSpecialty = this.selectedSpecialty === '' ||
        this.getSpecialtyValue(diagnostic.diagnosticSpecialty) === this.selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialty = '';
    this.filteredDiagnostics = this.diagnostics;
  }

  onEditDiagnostic(diagnostic: Diagnostic): void {
    this.router.navigate(['manage/diagnostics/edit', diagnostic.id]);
  }

  getFormattedSpecialtyName(specialty: DiagnosticSpecialty): string {
    const specialtyNames: { [key in DiagnosticSpecialty]: string } = {
      [DiagnosticSpecialty.GENERAL_MEDICINE]: 'Medicina General',
      [DiagnosticSpecialty.VETERINARY_SURGERY]: 'Cirugía Veterinaria',
      [DiagnosticSpecialty.VETERINARY_PATHOLOGY]: 'Patología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_RADIOLOGY]: 'Radiología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_NUTRITION]: 'Nutrición Veterinaria',
      [DiagnosticSpecialty.VETERINARY_BEHAVIOR]: 'Comportamiento Veterinario',
      [DiagnosticSpecialty.VETERINARY_OPHTHALMOLOGY]: 'Oftalmología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_DERMATOLOGY]: 'Dermatología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_CARDIOLOGY]: 'Cardiología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_ONCOLOGY]: 'Oncología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_NEUROLOGY]: 'Neurología Veterinaria',
      [DiagnosticSpecialty.VETERINARY_ORTHOPEDICS]: 'Ortopedia Veterinaria',
      [DiagnosticSpecialty.VETERINARY_PHYSIOTHERAPY]: 'Fisioterapia Veterinaria',
      [DiagnosticSpecialty.EMERGENCY_AND_CRITICAL_CARE]: 'Emergencias y Cuidados Críticos'
    };

    return specialtyNames[specialty] || specialty.toString();
  }

  // FIX: Nuevo método para obtener el valor correcto del enum
  private getSpecialtyValue(specialty: DiagnosticSpecialty): string {
    return String(specialty);
  }

  // FIX: Método corregido para obtener todas las especialidades
  getAllSpecialties(): { value: string, label: string }[] {
    const specialties: { value: string, label: string }[] = [];

    // Obtener todas las claves del enum
    Object.keys(DiagnosticSpecialty).forEach(key => {
      // Filtrar solo las claves que no sean números (para evitar duplicados en enums numéricos)
      if (isNaN(Number(key))) {
        const enumValue = DiagnosticSpecialty[key as keyof typeof DiagnosticSpecialty];
        specialties.push({
          value: this.getSpecialtyValue(enumValue),
          label: this.getFormattedSpecialtyName(enumValue)
        });
      }
    });

    return specialties;
  }

  createDiagnostic(): void {
    this.router.navigate(['/manage/diagnostics/add']);
  }
}
