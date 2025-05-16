export class MedicalHistory  {
  id: number;
  notes: string;

  constructor(medicalHistory: {
    id?: number,
    notes?: string,
  }) {
    this.id = medicalHistory.id || 0;
    this.notes = medicalHistory.notes || '';
  }
}
