/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { TransactionId } from '../../types/transaction';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthWarp from '../../components/auth';
import { Check, X, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import InputField from '../../components/input';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/ui/button';
import { validateBatchReferences, validateReference } from '../../utils/axios';

const MAX_REFERENCES = 10;
const REFERENCE_LENGTH = 16;

const TransactionIdInput = ({
    transactionIds,
    onAddTransactionId,
    onUpdateTransactionId,
    isValidating,
    onValidatingChange,
    onRemoveTransactionId,
}: {
    transactionIds: TransactionId[];
    onAddTransactionId: (newId: TransactionId) => void;
    onUpdateTransactionId: (id: string, updates: Partial<TransactionId>) => void;
    isValidating: boolean;
    onValidatingChange: (validating: boolean) => void;
    onRemoveTransactionId: (id: string) => void;
}) => {
    const [currentInput, setCurrentInput] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();
    const validTransactionIds = transactionIds.filter(tid => tid.isValid);
    const hasAutoValidated = useRef(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCurrentInput(value);

        if (value.length !== REFERENCE_LENGTH) {
            hasAutoValidated.current = false;
        }
    };

    const handleKeyUp = () => {
        if (currentInput.length === REFERENCE_LENGTH && !hasAutoValidated.current) {
            hasAutoValidated.current = true;
            handleAddTransactionId();
        }
    };

  const handleAddTransactionId = async () => {
    if (!currentInput.trim()) {
        toast({
            title: "Error",
            description: "Please enter a Transaction ID",
            variant: "destructive",
        });
        return;
    }

    if (currentInput.length !== REFERENCE_LENGTH) {
        toast({
            title: "Invalid Length",
            description: `Transaction ID must be exactly ${REFERENCE_LENGTH} characters`,
            variant: "destructive",
        });
        return;
    }

    if (transactionIds.length >= MAX_REFERENCES) {
        toast({
            title: "Limit Reached",
            description: `You can add up to ${MAX_REFERENCES} Transaction IDs only`,
            variant: "destructive",
        });
        return;
    }

    if (transactionIds.some(tid => tid.value === currentInput.trim())) {
        toast({
            title: "Duplicate ID",
            description: "This Transaction ID has already been added",
            variant: "warning", // Changed from "warning" to "destructive"
        });
        return;
    }

    const tempId: TransactionId = {
        id: Math.random().toString(36).substr(2, 9),
        value: currentInput.trim(),
        isValid: false,
        isValidating: true,
        paymentDetails: null 
    };

    // Add the transaction with validating state
    onAddTransactionId(tempId);
    onValidatingChange(true);

    try {
        const response = await validateReference(tempId.value);
        console.log('API Response:', response);

        if (response.isValid) {
            // Success case - valid transaction
            onUpdateTransactionId(tempId.id, {
                isValid: true,
                isValidating: false,
                paymentDetails: response.data?.payment
            });
            
            setCurrentInput("");
            
            // Show success toast with payment details if available
            const paymentAmount = response.data?.payment?.amount 
                ? `₦${response.data.payment.amount}` 
                : '';
            
            toast({
                title: response.message || "Success",
                description: paymentAmount 
                    ? `Valid payment reference for ${paymentAmount}`
                    : "Transaction reference validated successfully",
                variant: "success", // Success variant
            });
        } else {
            // Invalid transaction - remove from list and show error
            onRemoveTransactionId(tempId.id);
            
            toast({
                title: "Validation Failed",
                description: response.message || "Invalid payment reference",
                variant: "destructive",
            });
        }
    } catch (error: any) {
        console.error('Validation Error:', error);
        
        // Remove the invalid transaction from the list
        onRemoveTransactionId(tempId.id);
        
        toast({
            title: "Error",
            description: error.message || "Failed to validate Transaction ID",
            variant: "destructive",
        });
    } finally {
        onValidatingChange(false);
        hasAutoValidated.current = false;
    }
};

    const handleSaveAndContinue = async () => {
        try {
            if (validTransactionIds.length === 0) {
                toast({
                    title: "No Transactions",
                    description: "Please add at least one valid transaction ID",
                    variant: "destructive",
                });
                return;
            }

            onValidatingChange(true);

            const references = validTransactionIds.map(t => t.value);
            const response = await validateBatchReferences(references);

            if (!response.payments || response.payments.length === 0) {
                toast({
                    title: "Validation Error",
                    description: "No payment data found for the provided transaction IDs",
                    variant: "destructive",
                });
                return;
            }

            const allUnpaid = response.payments.every((payment: any) => payment.status === 'unpaid');
            if (!allUnpaid) {
                toast({
                    title: "Payment Status Error",
                    description: "Some transactions have already been paid",
                    variant: "destructive",
                });
                return;
            }

            navigate('/payment-batch-review', {
                state: {
                    transactionIds: validTransactionIds.map(t => t.value),
                    paymentDetails: response
                }
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to validate transaction IDs",
                variant: "destructive",
            });
        } finally {
            onValidatingChange(false);
        }
    };

    return (
        <div className="mb-8 bg-white">
            <div className="grid sm:grid-cols-2">
                <div className="space-y-2">
                    <div className="mb-16">
                        <h1 className="text-2xl font-semibold text-foreground mb-4">Transaction References</h1>
                        <p className="text-muted-foreground text-[#474D66] text-xs">
                            You can enter up to {MAX_REFERENCES} transaction references: ({transactionIds.length} of {MAX_REFERENCES})
                        </p>

                        <div className="flex items-center justify-start space-x-3 mb-4 rounded-[4px] py-4 px-4 bg-[#F4F6FA] mt-10">
                            <div className="p-2 bg-primary/10 rounded-lg" />
                            <span className="text-xs font-medium leading-4 text-foreground">Transaction References</span>
                        </div>

                        <div className="flex items-center justify-start space-x-3 mb-4">
                            <img src="life" alt="" />
                            <span className="text-xs">Transaction ID/References must be {REFERENCE_LENGTH} characters</span>
                        </div>
                    </div>

                    <div className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Transaction ID</div>
                    <div className="flex flex-col gap-4 space-x-2">
                        <InputField
                            id="transaction-id"
                            className='w-full'
                            value={currentInput}
                            name='transactionId'
                            onChange={handleInputChange}
                            onKeyUp={handleKeyUp}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTransactionId()}
                            placeholder={`Enter ${REFERENCE_LENGTH}-character transaction reference`}
                            disabled={isValidating || transactionIds.length >= MAX_REFERENCES}
                            maxLength={REFERENCE_LENGTH}
                            error={currentInput.length > 0 && currentInput.length !== REFERENCE_LENGTH ?
                                `Reference must be exactly ${REFERENCE_LENGTH} characters` : undefined}
                        />

                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                                {currentInput.length}/{REFERENCE_LENGTH} characters
                            </span>
                            {currentInput.length === REFERENCE_LENGTH && (
                                <span className="text-xs text-green-600">✓ Valid length</span>
                            )}
                        </div>
                    </div>

                    {transactionIds.length > 0 && (
                        <div className="mb-8 bg-white rounded-[4px] mt-6">
                            <div className="space-y-3">
                                {transactionIds.map((tid) => (
                                    <div key={tid.id} className="flex items-center justify-between p-1 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-mono text-sm">{tid.value}</span>
                                            {tid.isValidating ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            ) : tid.isValid ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <X className="h-4 w-4 text-destructive" />
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onRemoveTransactionId(tid.id)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        <Button variant="outline" className="flex items-center space-x-2">
                            <Link to="/" className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                <span>Back</span>
                            </Link>
                        </Button>
                        <Button
                            className="flex items-center space-x-2 bg-[#A51D21] text-white"
                            disabled={validTransactionIds.length === 0 || isValidating}
                            onClick={handleSaveAndContinue}
                        >
                            {
                                <>{isValidating &&
                                <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>Save & Continue</span>
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            }
                        </Button>
                    </div>
                </div>
                <div className='w-full'></div>
            </div>
        </div>
    );
};

const TransactionReferences = () => {
    const location = useLocation();
    const [transactionIds, setTransactionIds] = useState<TransactionId[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const incomingTransactionIds = location.state?.transactionIds || [];

    useEffect(() => {
        if (incomingTransactionIds.length > 0) {
            const recreatedTransactions = incomingTransactionIds.map((refId: string, index: number) => ({
                id: `restored_${index}_${refId}`,
                value: refId,
                isValid: true,
                isValidating: false,
            }));
            setTransactionIds(recreatedTransactions);
        }
    }, [incomingTransactionIds]);

    const handleAddTransactionId = (newId: TransactionId) => {
        setTransactionIds(prev => [...prev, newId]);
    };

    const handleUpdateTransactionId = (id: string, updates: Partial<TransactionId>) => {
        setTransactionIds(prev =>
            prev.map(tid =>
                tid.id === id ? { ...tid, ...updates } : tid
            )
        );
    };

    const handleRemoveTransactionId = (idToRemove: string) => {
        setTransactionIds(prev => prev.filter(tid => tid.id !== idToRemove));
    };

    return (
        <AuthWarp>
            <div className="max-w-full mx-auto p-3">
                <TransactionIdInput
                    transactionIds={transactionIds}
                    onAddTransactionId={handleAddTransactionId}
                    onUpdateTransactionId={handleUpdateTransactionId}
                    isValidating={isValidating}
                    onValidatingChange={setIsValidating}
                    onRemoveTransactionId={handleRemoveTransactionId}
                />
            </div>
        </AuthWarp>
    );
};

export default TransactionReferences;