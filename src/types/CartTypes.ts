export enum CartSettings {
  perPage = 3,
}

export interface ICartHeader {
  length: number;
}

export type storeItem = {
  id: number;
  quantity: number;
};

export interface ISummaryCart {
  totalSum: number;
  totalItems: number;
}
