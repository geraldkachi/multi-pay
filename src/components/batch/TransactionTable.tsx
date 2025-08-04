import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import TransactionDialog from "./TransactionDialog";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { BatchTransaction } from "../../types/batch";
import { formatCurrency } from "../../utils/batchUtils";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface TransactionTableProps {
  filteredData: BatchTransaction[];
  searchTerm: string;
  selectedRows: Set<string>;
  onRowSelect: (transactionId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  totalSum: number;
  onDeleteTransaction?: (transactionId: string) => void;
  isDeleting?: boolean;
}

const TransactionTable = ({ 
  filteredData, 
  searchTerm, 
  selectedRows, 
  onRowSelect, 
  onSelectAll, 
  totalSum,
  onDeleteTransaction,
  isDeleting = false,
}: TransactionTableProps) => {
  const isAllSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;
  const hasSelectedRows = selectedRows.size > 0;

  return (
    <Card className="mb-8">
      <CardHeader>
        {hasSelectedRows && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedRows.size} selected
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onDeleteTransaction) {
                  Array.from(selectedRows).forEach(id => onDeleteTransaction(id));
                }
              }}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? "No transactions match your search." : "No transactions found."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={onSelectAll}
                      aria-label="Select all"
                      disabled={isDeleting}
                    />
                  </TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead className="text-right">Charges</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(transaction.id)}
                        onCheckedChange={(checked) => onRowSelect(transaction.id, checked as boolean)}
                        aria-label={`Select transaction ${transaction.referenceId}`}
                        disabled={isDeleting}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.referenceId}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{transaction.customerName}</span>
                        {transaction.customerEmail && (
                          <span className="text-xs text-muted-foreground">
                            {transaction.customerEmail}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.applicationFee)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.charges)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.subTotal)}
                    </TableCell>
                    <TableCell>
                      <TransactionDialog 
                        transaction={transaction} 
                        onDelete={onDeleteTransaction}
                        isDeleting={isDeleting}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="border-t-2 bg-muted/30 font-medium">
                  <TableCell colSpan={4} className="text-right font-bold">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(
                      filteredData.reduce((sum, t) => sum + t.charges, 0)
                    )}
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">
                    {formatCurrency(totalSum)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionTable;