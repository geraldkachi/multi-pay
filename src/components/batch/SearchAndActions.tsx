import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
 } from "@radix-ui/react-alert-dialog";
import { Trash2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRowsCount: number;
  onDeleteSelected: () => void;
}

const SearchAndActions = ({ 
  searchTerm, 
  onSearchChange, 
  selectedRowsCount, 
  onDeleteSelected 
}: SearchAndActionsProps) => {
  return (
    <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {selectedRowsCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected ({selectedRowsCount})</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div>
                  <AlertDialogTitle>Delete Selected Transactions</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedRowsCount} selected transaction(s)? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </div>
                <div>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDeleteSelected}>Delete</AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndActions;