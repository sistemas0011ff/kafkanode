export interface IExtraGuarantee {
  extra_guarantee_id: string;
  price: number;
  priceOffer: number;
  sku: string;
  quantity: number;
  unique_code?: string;
  department?: string;
  description: string;
  date: Date;
  is_selected: boolean;
}
