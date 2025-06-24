import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BatchTransaction } from "../../types/batch";
import { Button } from "../ui/button";
import { secureStorage } from "../../lib/secureStorage";
import { validateServiceId } from "../../lib/dataValidation";


interface NavigationButtonsProps {
  selectedServiceId: string;
  batchData: BatchTransaction[];
  totalSum: number;
}

// const NavigationButtons = ({ selectedServiceId, batchData, totalSum }: NavigationButtonsProps) => {
const NavigationButtons = ({ selectedServiceId, batchData, totalSum }: NavigationButtonsProps) => {
  console.log(selectedServiceId, 'selectedServiceId')
  const navigate = useNavigate();

  const handleProceedToPayment = async () => {
    try {
      // Validate service ID before storing
      if (!validateServiceId(selectedServiceId)) {
        throw new Error('Invalid service ID');
      }
      
      // // Store selected service ID securely for the payment page
      await secureStorage.setItem('selectedServiceId', selectedServiceId);
      navigate('/make-payment', { state: { totalAmount: totalSum } });

      // window.location.href = 'https://staging-widget.ce-nextgen.com/payment-pages/87Q7DOghPVVLQR7v';

      // navigate('https://staging-widget.ce-nextgen.com//payment-pages/87Q7DOghPVVLQR7v', { state: { totalAmount: totalSum } });
    } catch (error) {
      console.error('Failed to store service ID:', error);
    }
  };

  return (
    <div className="flex justify-between">
      <Button variant="outline" className="flex items-center space-x-2" asChild>
        <Link className="flex items-center gap-2.5" to="/transaction-references" state={{ 
          selectedService: selectedServiceId,
          transactionIds: batchData.map(t => t.referenceId)
        }}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </Button>
      <Button 
        className="flex items-center space-x-2 px-8 sm:-x-16 cursor-pointer bg-[#A51D21] text-white rounded-[4px]" 
        // disabled={batchData.length === 0}
        onClick={handleProceedToPayment}
      >
        <span>Pay</span>
        {/* <ArrowRight className="h-4 w-4" /> */}
      </Button>
    </div>
  );
};

export default NavigationButtons;