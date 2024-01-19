export interface ICoupon {
  coupon_id: string;
  cart_id?: string;
  price_discount?: number;
  percentage_discount?: number;
  benefit?: string;
  coupon_name?: string;
  coupon_number: string; // deberia ser el id
  promotion_code?: string; // o couponnumber hay que ver
  promotion_code_generate?: string;
  coupon_text?: string;
  coupon_type?: string;
  date: Date;
  is_active: boolean;
}
