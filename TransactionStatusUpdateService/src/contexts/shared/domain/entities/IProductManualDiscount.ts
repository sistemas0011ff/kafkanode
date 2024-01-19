/* eslint-disable no-shadow */
enum ValueType {
  AMOUNT = 'amount',
  PERCENT = 'percent',
}

enum Responsible {
  CAR = 'CAR',
  ECCSA = 'ECCSA',
}

export interface IProductManualDiscount {
  value: number;
  value_type: ValueType;
  discount_type: number;
  responsible: Responsible;
  employee_dni: string;
  description?: string;
}

export default IProductManualDiscount;
