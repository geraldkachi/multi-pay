/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { TransactionId } from '../../types/transaction';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { services } from '../../constants/services';
import AuthWarp from '../../components/auth';
import { Check, X, Loader2, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import InputField from '../../components/input';
import { validateTransactionId } from '../../lib/dataValidation';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/ui/button';

const TransactionIdInput = ({
    transactionIds,
    onAddTransactionId,
    onUpdateTransactionId,
    isValidating,
    onValidatingChange,
    selectedService,
    onRemoveTransactionId,
    selectedServiceId
}: {
    transactionIds: TransactionId[];
    onAddTransactionId: (newId: TransactionId) => void;
    onUpdateTransactionId: (id: string, updates: Partial<TransactionId>) => void;
    isValidating: boolean;
    onValidatingChange: (validating: boolean) => void;
    selectedService: typeof services[0];
    onRemoveTransactionId: (id: string) => void;
    selectedServiceId: string;
}) => {
    const [currentInput, setCurrentInput] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();
    const IconComponent = selectedService.icon;
    const validTransactionIds = transactionIds.filter(tid => tid.isValid);

    const handleAddTransactionId = async () => {
        if (!currentInput.trim()) {
            toast({
                title: "Error",
                description: "Please enter a Transaction ID",
                variant: "destructive",
            });
            return;
        }

        if (transactionIds.length >= 20) {
            toast({
                title: "Limit Reached",
                description: "You can add up to 20 Transaction IDs only",
                variant: "destructive",
            });
            return;
        }

        if (transactionIds.some(tid => tid.value === currentInput.trim())) {
            toast({
                title: "Duplicate ID",
                description: "This Transaction ID has already been added",
                variant: "destructive",
            });
            return;
        }

        const newId: TransactionId = {
            id: Math.random().toString(36).substr(2, 9),
            value: currentInput.trim(),
            isValid: false,
            isValidating: true,
        };

        onAddTransactionId(newId);
        setCurrentInput("");
        onValidatingChange(true);

        try {
            const isValid = await validateTransactionId(newId.value);
            onUpdateTransactionId(newId.id, { isValid, isValidating: false });

            if (isValid) {
                toast({
                    title: "Success",
                    description: "Transaction ID validated successfully",
                });
            } else {
                toast({
                    title: "Validation Failed",
                    description: "Transaction ID could not be validated",
                    variant: "destructive",
                });
            }
        } catch (error) {
            onUpdateTransactionId(newId.id, { isValid: false, isValidating: false });
            toast({
                title: "Error",
                description: "Failed to validate Transaction ID",
                variant: "destructive",
            });
        } finally {
            onValidatingChange(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddTransactionId();
        }
    };

    const handleSaveAndContinue = async () => {
        try {
            const validationResults = await Promise.all(
                validTransactionIds.map(tid => validateTransactionId(tid.value))
            );

            const allValid = validationResults.every(isValid => isValid);

            if (!allValid) {
                toast({
                    title: "Validation Error",
                    description: "Some transaction IDs are invalid",
                    variant: "destructive",
                });
                return;
            }

            if (validTransactionIds.length === 0) {
                toast({
                    title: "No Transactions",
                    description: "Please add at least one valid transaction ID",
                    variant: "destructive",
                });
                return;
            }

            navigate('/payment-batch-review', {
                state: {
                    selectedService: selectedServiceId,
                    transactionIds: validTransactionIds.map(t => t.value)
                }
            });
        } catch (error) {
            console.error('Failed to proceed:', error);
            toast({
                title: "Error",
                description: "Failed to save transaction IDs",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="mb-8 bg-white">
            <div className="grid sm:grid-cols-2">
                <div className="space-y-2">
                    <div className="mb-16">
                        <h1 className="text-2xl font-semibold text-foreground mb-4">Transaction References</h1>
                        <p className="text-muted-foreground text-[#474D66] text-xs">
                            You can enter up to 20 transaction references for multiple payments: ({transactionIds.length} of 20)
                        </p>

                        <div className="flex items-center justify-start space-x-3 mb-4 rounded-[4px] py-4 px-4 bg-[#F4F6FA] mt-10">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xs font-medium leading-4 text-foreground">{selectedService.name}</span>
                        </div>

                        <div className="flex items-center justify-start space-x-3 mb-4">
                            <img src="life" alt="" />
                            <span className="text-xs">Transaction ID/References are generated on NIS portal</span>
                        </div>
                    </div>

                    <div className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Transaction ID</div>
                    <div className="flex flex-col gap-4 space-x-2">
                        <InputField
                            id="transaction-id"
                            className='w-full'
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter transaction reference"
                            disabled={isValidating || transactionIds.length >= 20}
                        />

                        <Button
                            onClick={handleAddTransactionId}
                            disabled={!currentInput.trim() || isValidating || transactionIds.length >= 20}
                            className="px-6 w-fit bg-transparent text-[#A73636]"
                        >
                            <Plus className="h-4 w-4 text-[#A73636] size-2" />
                            {isValidating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Add More"
                            )}
                        </Button>
                    </div>

                    {/* Integrated Transaction IDs List */}
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

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button variant="outline" className="flex items-center space-x-2">
                            <Link to="/" className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                <span>Back</span>
                            </Link>
                        </Button>
                        <Button
                            className="flex items-center space-x-2"
                            disabled={validTransactionIds.length === 0}
                            onClick={handleSaveAndContinue}
                        >
                            <span>Save & Continue</span>
                            <ArrowRight className="h-4 w-4 ml-2" />
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
    const navigate = useNavigate();
    const [transactionIds, setTransactionIds] = useState<TransactionId[]>([]);
    const [isValidating, setIsValidating] = useState(false);

    const selectedServiceId = location.state?.selectedService;
    const selectedService = services.find(s => s.id === selectedServiceId);
    const incomingTransactionIds = location.state?.transactionIds || [];

    useEffect(() => {
        if (!selectedService) {
            navigate("/");
        } else if (incomingTransactionIds.length > 0) {
            const recreatedTransactions = incomingTransactionIds.map((refId: any, index: any) => ({
                id: `restored_${index}_${refId}`,
                value: refId,
                isValid: true,
                isValidating: false,
            }));
            setTransactionIds(recreatedTransactions);
        }
    }, [selectedService, navigate, incomingTransactionIds]);

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

    // const validTransactionIds = transactionIds.filter(tid => tid.isValid);

    if (!selectedService) {
        return null;
    }

    return (
        <AuthWarp>
            <div className="max-w-full mx-auto p-6">
                <TransactionIdInput
                    transactionIds={transactionIds}
                    onAddTransactionId={handleAddTransactionId}
                    onUpdateTransactionId={handleUpdateTransactionId}
                    isValidating={isValidating}
                    onValidatingChange={setIsValidating}
                    selectedService={selectedService}
                    onRemoveTransactionId={handleRemoveTransactionId}
                    selectedServiceId={selectedServiceId}
                />
            </div>
        </AuthWarp>
    );
};

export default TransactionReferences;