export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED'
}

export class Appointment {
  id: number;
  appointmentName: string;
  registrationDate: string;
  endDate: string;
  status: AppointmentStatus;
  petId: number;
  tariffId: number;
  veterinarianId: number;
  startTimeAppointment:string;
  startDateAppointment:string;
  endTimeAppointment:string;
  endDateAppointment:string;

  // Attributes for appointment details
  notes: string;
  reminderEnabled: boolean;
  reminderTime: string;

  constructor(appointment: {
    id?: number;
    appointmentName?: string;
    registrationDate?: string;
    endDate?:string;
    status?: AppointmentStatus;
    petId?: number;
    tariffId?: number;
    veterinarianId?: number;
    startTimeAppointment?: string;
    startDateAppointment?: string;
    endTimeAppointment?: string;
    endDateAppointment?: string;
    notes?: string;
    reminderEnabled?: boolean;
    reminderTime?: string
  } = {}) {
    this.id = appointment.id || 0;
    this.appointmentName = appointment.appointmentName || '';
    this.registrationDate = appointment.registrationDate || '';
    this.endDate = appointment.endDate || '';
    this.status = appointment.status || AppointmentStatus.SCHEDULED;
    this.petId = appointment.petId || 0;
    this.tariffId = appointment.tariffId || 0;
    this.veterinarianId = appointment.veterinarianId || 0;
    this.startTimeAppointment = appointment.startTimeAppointment || '';
    this.startDateAppointment = appointment.startDateAppointment || '';
    this.endTimeAppointment = appointment.endTimeAppointment || '';
    this.endDateAppointment = appointment.endDateAppointment || '';
    this.notes = appointment.notes || '';
    this.reminderEnabled = appointment.reminderEnabled || false;
    this.reminderTime = appointment.reminderTime || '30'; // Default to 30 minutes before
  }
}
