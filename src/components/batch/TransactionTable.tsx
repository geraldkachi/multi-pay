import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from  "../ui/table";

import TransactionDialog from "./TransactionDialog";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { BatchTransaction } from "../../types/batch";
import { formatCurrency } from "../../utils/batchUtils";

interface TransactionTableProps {
  filteredData: BatchTransaction[];
  searchTerm: string;
  selectedRows: Set<string>;
  onRowSelect: (transactionId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  totalSum: number;
}

const TransactionTable = ({ 
  filteredData, 
  searchTerm, 
  selectedRows, 
  onRowSelect, 
  onSelectAll, 
  totalSum 
}: TransactionTableProps) => {
  const isAllSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;

  return (
    <Card className="mb-8">
      <CardHeader>
        {/* <CardTitle className="text-xl">Transaction Details</CardTitle> */}
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
                    />
                  </TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="text-right">Application Fee</TableHead>
                  <TableHead className="text-right">Charges</TableHead>
                  <TableHead className="text-right">Sub Total</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id}
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(transaction.id)}
                        onCheckedChange={(checked) => onRowSelect(transaction.id, checked as boolean)}
                        aria-label={`Select transaction ${transaction.referenceId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transaction.referenceId}</TableCell>
                    <TableCell className="font-medium">{transaction.customerName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.applicationFee)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.charges)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(transaction.subTotal)}</TableCell>
                    <TableCell>
                      <TransactionDialog transaction={transaction} />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="border-t-2 bg-muted/30 font-medium bg-[#F4F6FA] py-10">
                  <TableCell colSpan={5} className="text-right font-bold">
                    Total Payment:
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