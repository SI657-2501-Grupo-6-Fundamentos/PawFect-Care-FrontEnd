import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf, DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { Diagnostic, DiagnosticSpecialty } from "../../model/diagnostic.entity";
import { DiagnosticService } from "../../services/diagnostic.service";

@Component({
  selector: 'app-diagnostic-list-management',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  templateUrl: './diagnostic-list-management.component.html',
  styleUrl: './diagnostic-list-management.component.css'
})
export class DiagnosticListManagementComponent implements OnInit {
  diagnostics: Diagnostic[] = [];

  constructor(private diagnosticService: DiagnosticService, private router: Router) {}

  ngOnInit(): void {
    this.loadDiagnostics();
  }

  loadDiagnostics(): void {
    this.diagnosticService.getAll().subscribe({
      next: (data) => this.diagnostics = data,
      error: (err) => console.error('Error loading diagnostics', err)
    });
  }

  getFormattedDiagnosticName(specialty: DiagnosticSpecialty): string {
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

  onViewDiagnostic(diagnostic: Diagnostic): void {
    this.router.navigate(['/diagnostics/view', diagnostic.id]);
  }
}
