import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
// import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatCurrency } from "../../utils/batchUtils";
import { BatchTransaction } from "../../types/batch";
import { Button } from "../ui/button";
// import { formatCurrency } from "@/utils/batchUtils";
interface TransactionDialogProps {
  transaction: BatchTransaction;
}

const TransactionDialog = ({ transaction }: TransactionDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 bg-[#F4F6FA]">
          <div>
            <label className="text-sm font-medium text-muted-foreground">REFERENCE ID</label>
            <p className="font-mono text-sm">{transaction.referenceId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">CUSTOMER NAME</label>
            <p className="font-medium">{transaction.customerName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">APPLICATION FEE</label>
              <p>{formatCurrency(transaction.applicationFee)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CHARGES</label>
              <p>{formatCurrency(transaction.charges)}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">SUB TOTAL</label>
            <p className="text-lg font-bold">{formatCurrency(transaction.subTotal)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;