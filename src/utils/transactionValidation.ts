// Mock API call to validate transaction ID
export const validateTransactionId = async (transactionId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API response - returns true for IDs longer than 3 characters
      resolve(transactionId.length > 3);
    }, 1000);
  });
};