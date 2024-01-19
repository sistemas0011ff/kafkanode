/* eslint-disable no-shadow */
export enum ValueType {
  AMOUNT = 'amount',
  PERCENT = 'percent',
}

export enum Responsible {
  CAR = 'CAR',
  ECCSA = 'ECCSA',
}

export interface ITotalManualDiscount {
  value: number;
  value_type: ValueType;
  discount_type: number;
  responsible: Responsible;
  employee_dni: string;
  description?: string;
}

export default ITotalManualDiscount;
