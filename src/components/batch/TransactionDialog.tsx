import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Eye, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/batchUtils";
import { BatchTransaction } from "../../types/batch";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "../ui/alert-dialog";

interface TransactionDialogProps {
  transaction: BatchTransaction;
  onDelete?: (transactionId: string) => void;
}

const TransactionDialog = ({ transaction, onDelete }: TransactionDialogProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction.id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {/* View Details Dialog */}
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
          <div className="space-y-4 bg-[#F4F6FA] p-4 rounded-lg">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-[#A73636] text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionDialog;