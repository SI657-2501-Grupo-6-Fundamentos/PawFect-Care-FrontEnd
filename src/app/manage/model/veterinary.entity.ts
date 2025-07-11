export class Veterinary {
  id?: number;
  userId?: number;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  dni?: string;
  veterinarianSpeciality?: VeterinarianSpeciality;
  availableStartTime?: string;
  availableEndTime?: string;

  constructor(
    id: number = 0,
    userId: number = 0,
    fullName: string = '',
    phoneNumber: string = '',
    email: string = '',
    dni: string = '',
    veterinarianSpeciality: VeterinarianSpeciality = VeterinarianSpeciality.GENERAL,
    availableStartTime: string = '',
    availableEndTime: string = '',
  ) {
    this.id = id ?? '0';
    this.userId = userId ?? '0';
    this.fullName = fullName ?? '';
    this.phoneNumber = phoneNumber ?? '';
    this.email = email ?? '';
    this.dni = dni ?? '';
    this.veterinarianSpeciality = veterinarianSpeciality ?? '';
    this.availableStartTime = availableStartTime ?? '';
    this.availableEndTime = availableEndTime ?? '';
  }
}

export enum VeterinarianSpeciality {
  GENERAL = 'GENERAL',
  SURGERY = 'SURGERY',
  DERMATOLOGY = 'DERMATOLOGY',
  CARDIOLOGY = 'CARDIOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  ONCOLOGY = 'ONCOLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  DENTISTRY = 'DENTISTRY',
  EMERGENCY = 'EMERGENCY'
}
