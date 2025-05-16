export class MedicalAppointment {
    id: number;
    notes: string;
    diagnosis: string;
    treatment: string;
    appointmentId: number;
  
    constructor(record: {
      id?: number,
      notes?: string,
      diagnosis?: string,
      treatment?: string,
      appointmentId?: number
    }) {
      this.id = record.id || 0;
      this.notes = record.notes || '';
      this.diagnosis = record.diagnosis || '';
      this.treatment = record.treatment || '';
      this.appointmentId = record.appointmentId || 0;
    }
  }
  