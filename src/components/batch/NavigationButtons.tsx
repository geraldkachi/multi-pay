import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BatchTransaction } from "../../types/batch";
import { Button } from "../ui/button";
import { secureStorage } from "../../lib/secureStorage";
import { useToast } from "../../hooks/use-toast";
import { initializePayment } from "../../utils/axios";

interface NavigationButtonsProps {
  batchData: BatchTransaction[];
  totalSum: number;
}

const NavigationButtons = ({ batchData, totalSum }: NavigationButtonsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceedToPayment = async () => {
    try {
      // Store transaction references for potential return
      await secureStorage.setItem(
        'transactionReferences', 
        JSON.stringify(batchData.map(t => t.referenceId))
      );

       // Initialize payment with all references
      const paymentResponse = await initializePayment(
        batchData.map(t => t.referenceId)
      );
      if (paymentResponse.status && paymentResponse.data?.payment_url) {
        // Redirect to payment URL
        window.location.href = paymentResponse.data.payment_url;
      } else {
        throw new Error(paymentResponse.message || 'Payment initialization failed');
      }
      
      // Navigate to payment page with total amount
      // navigate('/make-payment', { 
      //   state: { 
      //     totalAmount: totalSum,
      //     transactionIds: batchData.map(t => t.referenceId)
      //   } 
      // });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed to payment",
        variant: "destructive",
      });
      console.error('Payment navigation error:', error);
    }
  };

  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        className="flex items-center space-x-2" 
        asChild
      >
        <Link 
          className="flex items-center gap-2.5" 
          to="/"
          state={{ transactionIds: batchData.map(t => t.referenceId) }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </Button>
      
      <Button 
        className="flex items-center space-x-2 px-8 sm:px-16 cursor-pointer bg-[#A51D21] text-white rounded-[4px]" 
        onClick={handleProceedToPayment}
        disabled={batchData.length === 0}
      >
        <span>Pay {totalSum > 0 ? `$${totalSum.toFixed(2)}` : ''}</span>
      </Button>
    </div>
  );
};

export default NavigationButtons;