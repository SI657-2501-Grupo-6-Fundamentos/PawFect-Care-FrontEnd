export class Appointment {
    id: number;
    appointmentName: string;
    registrationDate:string;
    endDate:string;
    isMedical: boolean;
    status: string;
    petId: number;
    startTimeAppointment:string;
    startDateAppointment:string;
    endTimeAppointment:string;
    endDateAppointment:String;

    constructor(appointment: {
      id?: number;
      appointmentName?: string;
      registrationDate?:string;
      endDate?:string
      isMedical?: boolean;
      status?: string;
      petId?: number;
      startTimeAppointment?:string;
      startDateAppointment?:string;
      endTimeAppointment?:string;
      endDateAppointment?:String;
    }) {
      this.id = appointment.id || 0;
      this.appointmentName = appointment.appointmentName || '';
      this.registrationDate=appointment.registrationDate || '';
      this.endDate=appointment.endDate || '';
      this.isMedical = appointment.isMedical || false;
      this.status = appointment.status || 'SCHEDULED';
      this.petId = appointment.petId || 0;
      this.startTimeAppointment=appointment.startTimeAppointment || '';
      this.startDateAppointment=appointment.startDateAppointment || '';
      this.endTimeAppointment=appointment.endTimeAppointment || '';
      this.endDateAppointment=appointment.endDateAppointment || '';
    }
  }
