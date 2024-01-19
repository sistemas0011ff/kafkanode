type ReturnedProductParams = {
  sku: string;
  ean13Style: string;
  quantity: number;
  price: number;
  discount: number;
  promotionCode: string;
  description: string;
  department: string;
  item: string;
};

export class ReturnedProduct {
  readonly sku: string;
  readonly ean13Style: string;
  readonly quantity: number;
  readonly price: number;
  readonly discount: number;
  readonly promotionCode: string;
  readonly description: string;
  readonly department: string;
  readonly item: string;

  constructor(params: ReturnedProductParams) {
    this.sku = params.sku;
    this.ean13Style = params.ean13Style;
    this.quantity = params.quantity;
    this.price = params.price;
    this.discount = params.discount;
    this.promotionCode = params.promotionCode;
    this.description = params.description;
    this.department = params.department;
    this.item = params.item;
  }

  static create(params: ReturnedProductParams): ReturnedProduct {
    return new ReturnedProduct(params);
  }

  toPrimitives(): any {
    return {
      sku: this.sku,
      ean13Style: this.ean13Style,
      quantity: this.quantity,
      price: this.price,
      discount: this.discount,
      promotionCode: this.promotionCode,
      description: this.description,
      department: this.department,
      item: this.item,
    };
  }
}
