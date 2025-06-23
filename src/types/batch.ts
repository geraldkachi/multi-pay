export interface BatchTransaction {
  id: string;
  referenceId: string;
  customerName: string;
  applicationFee: number;
  charges: number;
  subTotal: number;
}

export interface Service {
  id: string;
  name: string;
  icon: any;
}