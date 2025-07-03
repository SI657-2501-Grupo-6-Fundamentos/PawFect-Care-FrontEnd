export class Pet {
  id: number;
  petName: string;
  birthDate: string;
  registrationDate: string;
  animalType: string;
  animalBreed: string;
  petGender: string;
  ownerId: number;

  constructor(pet: {
    id?: number;
    petName?: string;
    birthDate?: string;
    registrationDate?: string;
    animalType?: string;
    animalBreed?: string;
    petGender?: string;
    ownerId?: number;
  }) {
    this.id = pet.id || 0;
    this.petName = pet.petName || '';
    this.birthDate = pet.birthDate || '';
    this.registrationDate = pet.registrationDate || '';
    this.animalType = pet.animalType?.toUpperCase().toLowerCase() || '';
    this.animalBreed = pet.animalBreed?.toUpperCase().toLowerCase() || '';
    this.petGender = pet.petGender || 'MALE';
    this.ownerId = pet.ownerId || 0;
  }
}
