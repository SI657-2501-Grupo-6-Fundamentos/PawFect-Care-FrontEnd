export class Treatment {
  id: number;
  diagnosticDate: string;
  description: string;
  diagnosticType: string;

  constructor(treatment: {
    id?: number;
    diagnosticDate?: string;
    description?: string;
    diagnosticType?: string;
  }) {
    this.id = treatment.id || 0;
    this.diagnosticDate = treatment.diagnosticDate || '';
    this.description = treatment.description || '';
    this.diagnosticType = treatment.diagnosticType || '';
  }
}
