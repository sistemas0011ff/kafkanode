import { ICoupon } from './ICoupon';
import { IProduct } from './IProduct';
import { ICustomerInfo } from './ICustomerInfo';
import { IPaymentInfo } from './IPaymentInfo';
import { IRClub } from './IRClub';
import { ICouponCsg } from './ICouponCsg';
import { ITotalManualDiscount } from './ITotalManualDiscount';
import { ReturnedProduct } from './ReturnedProduct';

export interface IShoppingCart {
  cart_id: string;
  store: string;
  checkout: string;
  country: string;
  channel: string;
  currency: string;
  total_price: number;
  total_price_tr: number;
  total_price_discount: number;
  total_price_tr_discount: number;
  total_manual_discount: number;
  total_manual_discount_tr: number;
  payment_method_id: string;
  total_discount: number;
  total_discount_tr: number;
  products_quantity: number;
  transaction_number: string; // correlativo caja-sucursal
  order_number?: number; // correlativo por canal
  order_id?: string;
  customer_dni?: string;
  seller_dni?: string;
  email?: string;
  payment_method?: string;
  payment_info?: IPaymentInfo;
  status: string;
  fees?: string;
  date: Date;
  is_active: boolean;
  products: Array<IProduct>;
  coupons: Array<ICoupon>;
  customer_info: ICustomerInfo;
  rclub?: IRClub;
  couponsCsg?: Array<ICouponCsg>;
  manual_discount?: ITotalManualDiscount;
  changes?: {
    authorizedByDni: string;
    sellerDni: string;
    transactionNumber: string;
    date: string;
    store: number;
    checkout: string;
    isRipley: boolean;
    reason: string;
    products: Array<ReturnedProduct>;
  };
}
