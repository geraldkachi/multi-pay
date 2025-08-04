export interface TransactionId {
  id: string;
  value: string;
  isValid: boolean;
  isValidating: boolean;
  paymentDetails: any
}

export interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}