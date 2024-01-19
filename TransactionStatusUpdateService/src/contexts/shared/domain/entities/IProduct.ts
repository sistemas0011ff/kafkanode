import { IExtraGuarantee } from './IExtraGuarantee';
import { IProductManualDiscount } from './IProductManualDiscount';

export interface IProduct {
  _id?: string;
  product_id: string;
  price: number;
  price_tr: number;
  price_discount: number;
  discount: number;
  discount_unit: number;
  discount_tr: number;
  discount_tr_unit: number;
  total_price: number;
  total_price_discount: number;
  total_price_tr: number;
  total_price_tr_discount: number;
  total_manual_discount: number;
  total_manual_discount_tr: number;
  sku: string;
  ean13?: string;
  linecode?: string;
  department?: string;
  description: string;
  address?: string;
  shipping?: string;
  date: Date;
  quantity: number;
  is_active: boolean;
  message_promotion?: string;
  code_promotion?: string;
  message_promotion_ripley?: string;
  code_promotion_ripley?: string;
  extraGuarantee?: Array<IExtraGuarantee>;
  manual_discount?: IProductManualDiscount;
}
