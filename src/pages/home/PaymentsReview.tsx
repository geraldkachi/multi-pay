import { useEffect, useMemo, useState } from 'react';
import AuthWarp from '../../components/auth';
import { useToast } from '../../hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateAndSanitizeJsonData } from '../../lib/dataValidation';
import { secureStorage } from '../../lib/secureStorage';
import { BatchTransaction } from '../../types/batch';
import BatchHeader from '../../components/batch/BatchHeader';
import SearchAndActions from '../../components/batch/SearchAndActions';
import TransactionTable from '../../components/batch/TransactionTable';
import NavigationButtons from '../../components/batch/NavigationButtons';

interface PaymentDetails {
  payments: Array<{
    reference: string;
    amount: number;
    currency: string;
    email: string;
    status: string;
    metadata?: string;
  }>;
}

const PaymentsReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [batchData, setBatchData] = useState<BatchTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Get payment details from navigation state
  const paymentDetails = location.state?.paymentDetails as PaymentDetails | undefined;
console.log(paymentDetails, 'paymentDetails')
  // Load and generate batch data from payment details
  useEffect(() => {
    const loadBatchData = async () => {
      try {
        setIsLoading(true);

        if (paymentDetails?.payments) {
          // Transform payment details into batch transactions
          const transactions = paymentDetails.payments.map(payment => ({
            id: `txn_${payment.reference}`,
            referenceId: payment.reference,
            customerName: payment.email.split('@')[0] || 'Customer',
            customerEmail: payment.email,
            applicationFee: 0,
            // applicationFee: calculateFee(payment.amount),
            // charges: calculateCharges(payment.amount),
            charges:  0,
            subTotal: payment.amount,
            status: payment.status === 'unpaid' ? 'pending' : payment.status,
            currency: payment.currency
          }));

          const sanitizedData = validateAndSanitizeJsonData(transactions);
          setBatchData(sanitizedData);
          await secureStorage.setItem('batchData', JSON.stringify(sanitizedData));
        } else {
          // Fallback to secureStorage if no payment details
          const storedBatchData = await secureStorage.getItem('batchData');
          if (storedBatchData) {
            setBatchData(validateAndSanitizeJsonData(JSON.parse(storedBatchData)));
          } else {
            throw new Error('No payment data available');
          }
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load payment data",
          variant: "destructive",
        });
        navigate('/');
        // navigate('/transaction-references');
      } finally {
        setIsLoading(false);
      }
    };

    loadBatchData();
  }, [navigate, toast, paymentDetails]);

  // Helper functions for fee calculations
  // const calculateFee = (amount: number): number => {
  //   return Math.floor(amount * 0.02); // 2% fee
  // };

  // const calculateCharges = (amount: number): number => {
  //   return Math.floor(amount * 0.01); // 1% charges
  // };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return batchData;
    
    return batchData.filter(transaction =>
      transaction.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.applicationFee.toString().includes(searchTerm) ||
      transaction.charges.toString().includes(searchTerm) ||
      transaction.subTotal.toString().includes(searchTerm)
    );
  }, [batchData, searchTerm]);

  // Calculate total sum
  const totalSum = useMemo(() => {
    return filteredData.reduce((sum, transaction) => sum + transaction.subTotal, 0);
  }, [filteredData]);

  // Handle row selection
  const handleRowSelect = (transactionId: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(transactionId);
    } else {
      newSelection.delete(transactionId);
    }
    setSelectedRows(newSelection);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? new Set(filteredData.map(t => t.id)) : new Set());
  };

  // Handle delete selected rows
  const handleDeleteSelected = async () => {
    try {
      const remainingData = batchData.filter(transaction => !selectedRows.has(transaction.id));
      const sanitizedData = validateAndSanitizeJsonData(remainingData);
      setBatchData(sanitizedData);
      await secureStorage.setItem('batchData', JSON.stringify(sanitizedData));
      setSelectedRows(new Set());
      
      toast({
        title: "Success",
        description: `Deleted ${selectedRows.size} transaction(s)`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete transactions",
        variant: "destructive",
      });
    }
  };

  // Handle delete single transaction
  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const remainingData = batchData.filter(transaction => transaction.id !== transactionId);
      const sanitizedData = validateAndSanitizeJsonData(remainingData);
      setBatchData(sanitizedData);
      await secureStorage.setItem('batchData', JSON.stringify(sanitizedData));
      
      // Remove from selected rows if it was selected
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(transactionId);
        return newSet;
      });
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AuthWarp>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payment data...</p>
          </div>
        </div>
      </AuthWarp>
    );
  }

  if (batchData.length === 0) {
    return (
      <AuthWarp>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-muted-foreground">No payment transactions found</p>
            <button 
              onClick={() => navigate('/transaction-references')}
              className="mt-4 text-primary hover:underline"
            >
              Add new transactions
            </button>
          </div>
        </div>
      </AuthWarp>
    );
  }

  return (
    <AuthWarp>
      <div className="max-w-6xl mx-auto">
        <BatchHeader transactionCount={batchData.length} />
        
        <SearchAndActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRowsCount={selectedRows.size}
          onDeleteSelected={handleDeleteSelected}
        />

        <TransactionTable 
          filteredData={filteredData}
          searchTerm={searchTerm}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          totalSum={totalSum}
          onDeleteTransaction={handleDeleteTransaction}
        />

        <NavigationButtons
          batchData={batchData}
          totalSum={totalSum}
        />
      </div>
    </AuthWarp>
  );
};

export default PaymentsReview;