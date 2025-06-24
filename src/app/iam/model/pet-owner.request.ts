export class PetOwnerRequest {
    public userId: number;
    public fullName: string;
    public phoneNumber: string;
    public email: string;
    public address: string;

    constructor(userId: number, fullName: string, phoneNumber: string, email: string, address: string) {
        this.userId = userId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
    }
}
