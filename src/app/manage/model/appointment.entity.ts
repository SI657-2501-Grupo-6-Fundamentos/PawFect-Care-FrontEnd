export enum ServiceName {
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
  endDateAppointment:String;

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
  }
}
