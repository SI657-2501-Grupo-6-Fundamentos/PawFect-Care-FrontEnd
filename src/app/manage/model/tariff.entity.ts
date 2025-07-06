export class Tariff {
  id: number;
  serviceName: Tariff.ServiceName;
  cost: number;
  minimumCost: number;
  maximumCost: number;

  constructor(
    id: number,
    serviceName: Tariff.ServiceName,
    cost: number,
    minimumCost: number,
    maximumCost: number
  ) {
    this.id = id;
    this.serviceName = serviceName;
    this.cost = cost;
    this.minimumCost = minimumCost;
    this.maximumCost = maximumCost;
  }

}

export namespace Tariff {
  export enum ServiceName {
    GENERAL_MEDICINE = 'GENERAL_MEDICINE',
    VETERINARY_SURGERY = 'VETERINARY_SURGERY',
    VETERINARY_PATHOLOGY = 'VETERINARY_PATHOLOGY',
    VETERINARY_RADIOLOGY = 'VETERINARY_RADIOLOGY',
    VETERINARY_NUTRITION = 'VETERINARY_NUTRITION',
    VETERINARY_BEHAVIOR = 'VETERINARY_BEHAVIOR',
    EMERGENCY_AND_CRITICAL_CARE = 'EMERGENCY_AND_CRITICAL_CARE'
  }
}
