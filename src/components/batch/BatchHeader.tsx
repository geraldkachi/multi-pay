import { Service } from "../../types/transaction";

interface BatchHeaderProps {
  selectedService?: Service;
  transactionCount: number;
}

const BatchHeader = ({ transactionCount }: BatchHeaderProps) => {
  // const IconComponent = selectedService.icon;

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Review Payment Batch</h1>
      
      {/* Selected Service Display */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {/* <IconComponent className="h-6 w-6 text-primary" /> */}
        </div>
        {/* <span className="text-xl font-medium text-foreground">{selectedService?.name}</span> */}
      </div>
      
      <p className="text-muted-foreground">
        Review all transactions for this batch ({transactionCount} transactions)
      </p>
    </div>
  );
};

export default BatchHeader;