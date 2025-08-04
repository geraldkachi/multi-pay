/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { BatchTransaction } from "../../types/batch";
import { Button } from "../ui/button";
import { secureStorage } from "../../lib/secureStorage";
import { useToast } from "../../hooks/use-toast";
import { initializePayment } from "../../utils/axios";
import { useState } from "react";

interface NavigationButtonsProps {
  batchData: BatchTransaction[];
  totalSum: number;
}

const NavigationButtons = ({ batchData, totalSum }: NavigationButtonsProps) => {
  const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);


  const handleProceedToPayment = async () => {
      setIsProcessing(true);
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
         toast({
          title: "Payment Initialized Successfully",
          description: paymentResponse.message || "Redirecting to payment gateway...",
          variant: "success", // Success variant
        });
        // Redirect to payment URL
        window.location.href = paymentResponse.data.payment_url;
      } else {
         toast({
        title: "Error",
        description: paymentResponse.message || "Failed to initialize payment",
        variant: "destructive",
      });
        throw new Error(paymentResponse.message || 'Payment initialization failed');
      }

    } catch (error: any ) {
      toast({
        title: "Error",
        description: error.message  || "Failed to proceed to payment",
        variant: "destructive",
      });
      console.error('Payment navigation error:', error);
    } finally {
      setIsProcessing(false);
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
        className="flex items-center px-8 sm:px-16 cursor-pointer bg-[#A51D21] text-white rounded-[4px]" 
        onClick={handleProceedToPayment}
        disabled={batchData.length === 0 }
      >
      {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
      <span className="whitespace-nowrap">Pay {totalSum > 0 ? `$${totalSum.toFixed(2)}` : ''}</span>
      </Button>
    </div>
  );
};

export default NavigationButtons;