import { useEffect, useMemo, useState } from 'react';
import AuthWarp from '../../components/auth'
import { services } from '../../constants/services';
import { useToast } from '../../hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateAndSanitizeJsonData, validateTransactionId } from '../../lib/dataValidation';
import { generateBatchData } from '../../utils/batchUtils';
import { secureStorage } from '../../lib/secureStorage';
import { BatchTransaction } from '../../types/batch';
import BatchHeader from '../../components/batch/BatchHeader';
// import SearchAndActions from '../../components/batch/SearchAndActions';
import TransactionTable from '../../components/batch/TransactionTable';
import NavigationButtons from '../../components/batch/NavigationButtons';

const PaymentsReview = () => {
   const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [batchData, setBatchData] = useState<BatchTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Get selected service from navigation state
  const selectedServiceId = location.state?.selectedService;
  const selectedService = services.find(s => s.id === selectedServiceId);

  // Load and generate batch data
  useEffect(() => {
    const loadBatchData = async () => {
      try {
        // Get transaction IDs from secure storage
        // const storedTransactionIds = await secureStorage.getItem('validTransactionIds');
        // if (!storedTransactionIds) {
        // //   navigate('/transaction-references');
        //   return;
        // }

        // const transactionIds = JSON.parse(storedTransactionIds);
        
        // // Validate transaction IDs
        // const validIds = transactionIds.filter((id: string) => validateTransactionId(id));
        // if (validIds.length === 0) {
        // //   navigate('/transaction-references');
        //   return;
        // }

        // // Check if we already have batch data for these IDs
        // const storedBatchData = await secureStorage.getItem('batchData');
        // if (storedBatchData) {
        //   const parsedData = JSON.parse(storedBatchData);
        //   const sanitizedData = validateAndSanitizeJsonData(parsedData);
          
        //   // Verify the data matches current transaction IDs
        //   if (sanitizedData.length === validIds.length) {
        //     setBatchData(sanitizedData);
        //     setIsLoading(false);
        //     return;
        //   }
        // }

        // // Generate new batch data
        // const newBatchData = generateBatchData(validIds);
        // const sanitizedBatchData = validateAndSanitizeJsonData(newBatchData);
        // setBatchData(sanitizedBatchData);
        // await secureStorage.setItem('batchData', JSON.stringify(sanitizedBatchData));
        // setIsLoading(false);

         if (location.state?.transactionIds) {
          const transactionIds = location.state.transactionIds;
          const validIds = transactionIds.filter((id: string) => validateTransactionId(id));
          
          // Generate and set batch data
          const newBatchData = generateBatchData(validIds);
          const sanitizedBatchData = validateAndSanitizeJsonData(newBatchData);
          setBatchData(sanitizedBatchData);
          await secureStorage.setItem('batchData', JSON.stringify(sanitizedBatchData));
          setIsLoading(false);
          return;
        }

        // Fallback to secureStorage if no navigation state
        const storedTransactionIds = await secureStorage.getItem('validTransactionIds');
        if (!storedTransactionIds) {
          navigate('/transaction-references');
          return;
        }

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load batch data",
          variant: "destructive",
        });
        navigate('/transaction-references');
      }
    };

    loadBatchData();
  }, [navigate, toast]);

  // Redirect if no service selected
  useEffect(() => {
    if (!selectedService) {
    //   navigate("/");
    }
  }, [selectedService, navigate]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return batchData;
    
    return batchData.filter(transaction =>
      transaction.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (checked) {
      setSelectedRows(new Set(filteredData.map(t => t.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle delete selected rows
//   const handleDeleteSelected = async () => {
//     try {
//       const remainingData = batchData.filter(transaction => !selectedRows.has(transaction.id));
//       const sanitizedData = validateAndSanitizeJsonData(remainingData);
//       setBatchData(sanitizedData);
//       await secureStorage.setItem('batchData', JSON.stringify(sanitizedData));
//       setSelectedRows(new Set());
      
//       toast({
//         title: "Success",
//         description: `Deleted ${selectedRows.size} transaction(s)`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete transactions",
//         variant: "destructive",
//       });
//     }
//   };

  if (!selectedService) {
    return null;
  }

//   if (isLoading) {
//     return (
//       <AuthWarp>
//         <div className="flex items-center justify-center min-h-96">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Loading batch data...</p>
//           </div>
//         </div>
//       </AuthWarp>
//     );
//   }

  return (
    <AuthWarp>
      <div className="max-w-6xl mx-auto">
        <BatchHeader selectedService={selectedService} transactionCount={batchData.length} />
        
        {/* <SearchAndActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRowsCount={selectedRows.size}
          onDeleteSelected={handleDeleteSelected}
        /> */}

        <TransactionTable 
          filteredData={filteredData}
          searchTerm={searchTerm}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          totalSum={totalSum}
        />

        <NavigationButtons
          selectedServiceId={selectedServiceId}
          batchData={batchData}
          totalSum={totalSum}
        />
      </div>
    </AuthWarp>
  )
}

export default PaymentsReview