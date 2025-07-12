export class MedicalRecord {
  id: number;
  title: string;
  notes: string;
  diagnosticId?: number;
  appointmentId?: number;
  recordedAt: Date;

  constructor(medicalRecord: {
    id?: number;
    title?: string;
    notes?: string;
    diagnosticId?: number;
    appointmentId?: number;
    recordedAt?: Date;
  }) {
    this.id = medicalRecord.id || 0;
    this.title = medicalRecord.title || '';
    this.notes = medicalRecord.notes || '';
    this.diagnosticId = medicalRecord.diagnosticId;
    this.appointmentId = medicalRecord.appointmentId;
    this.recordedAt = medicalRecord.recordedAt || new Date();
  }
}
