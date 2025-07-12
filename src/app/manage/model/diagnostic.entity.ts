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
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  VETERINARY_SURGERY = 'VETERINARY_SURGERY',
  VETERINARY_PATHOLOGY = 'VETERINARY_PATHOLOGY',
  VETERINARY_RADIOLOGY = 'VETERINARY_RADIOLOGY',
  VETERINARY_NUTRITION = 'VETERINARY_NUTRITION',
  VETERINARY_BEHAVIOR = 'VETERINARY_BEHAVIOR',
  VETERINARY_OPHTHALMOLOGY = 'VETERINARY_OPHTHALMOLOGY',
  VETERINARY_DERMATOLOGY = 'VETERINARY_DERMATOLOGY',
  VETERINARY_CARDIOLOGY = 'VETERINARY_CARDIOLOGY',
  VETERINARY_ONCOLOGY = 'VETERINARY_ONCOLOGY',
  VETERINARY_NEUROLOGY = 'VETERINARY_NEUROLOGY',
  VETERINARY_ORTHOPEDICS = 'VETERINARY_ORTHOPEDICS',
  VETERINARY_PHYSIOTHERAPY = 'VETERINARY_PHYSIOTHERAPY',
  EMERGENCY_AND_CRITICAL_CARE = 'EMERGENCY_AND_CRITICAL_CARE'
}
