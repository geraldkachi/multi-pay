import { BatchTransaction } from "../types/batch";

// Mock customer names for generation
const mockCustomerNames = [
  "Adebayo Johnson", "Fatima Mohammed", "Chinedu Okafor", "Aisha Bello",
  "Emeka Nwosu", "Kemi Adeleke", "Ibrahim Yakubu", "Ngozi Okoro",
  "Musa Abdullahi", "Folake Adeyemi", "Usman Garba", "Chioma Eze",
  "Ahmed Hassan", "Funmi Oladele", "Sani Musa", "Blessing Udo"
];

// Generate random amount between min and max
const generateAmount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate mock batch data based on transaction IDs
export const generateBatchData = (transactionIds: string[]): BatchTransaction[] => {
  return transactionIds.map((refId, index) => {
    const applicationFee = generateAmount(500, 2000);
    const charges = generateAmount(100, 800);
    
    return {
      id: `batch_${index}_${refId}`,
      referenceId: refId,
      customerName: mockCustomerNames[Math.floor(Math.random() * mockCustomerNames.length)],
      applicationFee,
      charges,
      subTotal: applicationFee + charges,
    };
  });
};

// Format currency with Naira symbol
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};