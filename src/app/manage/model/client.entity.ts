
  export class Client {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
  
    constructor(owner: {
      id?: number;
      fullName?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
    }) {
      this.id = owner.id || 0;
      this.fullName = owner.fullName || '';
      this.phoneNumber = owner.phoneNumber || '';
      this.email = owner.email || '';
      this.address = owner.address || '';
    }
  }
  