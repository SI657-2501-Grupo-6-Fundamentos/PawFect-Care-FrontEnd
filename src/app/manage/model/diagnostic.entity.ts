export class Diagnostic {
  id: number;
  diagnosticDate: string;
  description: string;
  diagnosticSpecialty: DiagnosticSpecialty;

  constructor(diagnostic: {
    id?: number;
    diagnosticDate?: string;
    description: string;
    diagnosticSpecialty: DiagnosticSpecialty;
  }) {
    this.id = diagnostic.id ?? 0;
    this.diagnosticDate = diagnostic.diagnosticDate ?? '';
    this.description = diagnostic.description;
    this.diagnosticSpecialty = diagnostic.diagnosticSpecialty;
  }
}

export enum DiagnosticSpecialty {
  GENERAL_MEDICINE,
  VETERINARY_SURGERY,
  VETERINARY_PATHOLOGY,
  VETERINARY_RADIOLOGY,
  VETERINARY_NUTRITION,
  VETERINARY_BEHAVIOR,
  VETERINARY_OPHTHALMOLOGY,
  VETERINARY_DERMATOLOGY,
  VETERINARY_CARDIOLOGY,
  VETERINARY_ONCOLOGY,
  VETERINARY_NEUROLOGY,
  VETERINARY_ORTHOPEDICS,
  VETERINARY_PHYSIOTHERAPY,
  EMERGENCY_AND_CRITICAL_CARE
}

