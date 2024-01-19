export interface ICouponCsg {
  coupon_id: string;
  cart_id?: string; // todo: remover
  coupon_number?: string; // deberia ser el id
  promotion_code?: string; // o couponnumber hay que ver
  promotion_code_generate?: string;
  coupon_text?: string;
  coupon_type?: string;
  date: Date;
  is_active: boolean;
  is_ripley?: boolean;
}
