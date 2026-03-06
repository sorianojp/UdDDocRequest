import AppLayout from '@/layouts/app-layout';
import registrar from '@/routes/registrar';
import { BreadcrumbItem, SharedData, DocumentRequest } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Calendar, CheckCircle, Clock, Plus, X, ExternalLink, Save, Eye, User, FileText, GraduationCap, Mail, MapPin, Building, CreditCard, PackageCheck, ClipboardList, IdCard } from 'lucide-react';

export default function RequestDetails({
    request,
    deficiencies,
}: {
    request: DocumentRequest;
    deficiencies: string[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        status: request.status,
        deficiency_remarks: request.deficiency_remarks || '',
        claiming_date: request.claiming_date ? request.claiming_date.split('T')[0] : '',
        items: (request.items || []) as any[], // Add items to form state
    });



    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Requests',
            href: registrar.index.url(),
        },
        {
            title: request.reference_number,
            href: registrar.show.url(request.id),
        },
    ];

    // Sort deficiencies alphabetically or by ID as needed, but standard ones first?
    // For now, simple list.
    const deficiencyOptions = deficiencies;

    const getSelectedDeficiencies = (): string[] => {
        if (!data.deficiency_remarks) return [];
        return data.deficiency_remarks.split('|').map((s: string) => s.trim()).filter(Boolean);
    };

    const autoSave = (updates: Partial<typeof data>) => {
        const newData = { ...data, ...updates };
        setData(newData);
        
        router.put(registrar.update.url(request.id), newData, {
            preserveScroll: true,
            onError: (errors) => {
                // Ideally handle errors, but for auto-save maybe just console or toast
                console.error("Auto-save failed", errors);
            }
        });
    };

    const toggleDeficiency = (option: string, checked: boolean) => {
        let current = getSelectedDeficiencies();
        if (checked) {
            if (!current.includes(option)) current.push(option);
        } else {
            current = current.filter((item: string) => item !== option);
        }
        const newRemarks = current.join('|');
        autoSave({ deficiency_remarks: newRemarks });
    };

    const handlePaymentUpdate = (status: 'verified' | 'rejected') => {
        if (!request.payment) return;
        router.put(`/registrar/payments/${request.payment.id}`, { status }, {
            onSuccess: () => {
                // Update local status to reflect the backend automation
                if (status === 'verified') {
                    setData('status', 'PROCESSING');
                } else if (status === 'rejected') {
                    setData('status', 'WAITING_FOR_PAYMENT');
                }
            }
        });
    };

    const handleRejectRequest = () => {
        if (confirm('Are you sure you want to REJECT this entire request? This action cannot be undone.')) {
            autoSave({ status: 'REJECTED' });
        }
    };

    const handlePriceChange = (id: number, newPrice: string) => {
        const updatedItems = data.items.map((item: any) => 
            item.id === id ? { ...item, price: newPrice } : item
        );
        setData('items', updatedItems);
        // We defer saving until the "Verify" button is clicked or use onBlur if needed
    };

    const verifyAndSetPayment = () => {
         // This sets status to WAITING_FOR_PAYMENT and saves items prices
         autoSave({ status: 'WAITING_FOR_PAYMENT', items: data.items });
    };

    // Derived state for formatting
    const selectedDeficiencies = getSelectedDeficiencies();
    
    // Status Badge Helper
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
            case 'WAITING_FOR_PAYMENT':
                return <Badge variant="warning">Waiting Payment</Badge>;
            case 'VERIFYING_PAYMENT':
                return <Badge variant="orange">Verify Payment</Badge>;
            case 'PROCESSING':
                return <Badge variant="info">Processing</Badge>;
            case 'DEFICIENT':
                return <Badge variant="destructive">Deficient</Badge>;
            case 'READY':
                return <Badge variant="success">Ready</Badge>;
            case 'CLAIMED':
                return <Badge variant="outline">Claimed</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Rejected</Badge>;
            case 'CANCELLED':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };
    
    // Disable actions if payment is missing, pending, or rejected
    const isReadOnly = data.status === 'REJECTED';
    const isActionsDisabled = isReadOnly || !request.payment || request.payment.status === 'pending' || request.payment.status === 'rejected';

    const renderPaymentDetails = () => (
        request.payment && (
            <Card className={
                request.payment.status === 'rejected' ? 'border-red-500 border-2 dark:border-red-700' : 
                request.payment.status === 'verified' ? 'border-green-500 border-2 dark:border-green-700' : ''
            }>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-foreground">
                            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Payment Details</CardTitle>
                                <CardDescription>Payment information and proof.</CardDescription>
                            </div>
                        </div>
                        <Badge variant={
                            request.payment.status === 'verified' ? 'success' : 
                            request.payment.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                            {request.payment.status.charAt(0).toUpperCase() + request.payment.status.slice(1)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 items-start">
                        <div>
                            <Label className="text-muted-foreground">Amount</Label>
                            <p className="font-bold">₱{request.payment.amount}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Bank Reference No.</Label>
                            <p className="font-mono text-sm font-bold">{request.payment.reference_number}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Proof of Payment</Label>
                            {request.payment.proof_file_path ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full mt-1">
                                            <Eye className="mr-2 h-4 w-4" /> View Proof
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Proof of Payment</DialogTitle>
                                            <DialogDescription>
                                                Reference: {request.payment.reference_number}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
                                            <img
                                                src={`/storage/${request.payment.proof_file_path}`}
                                                alt="Proof of Payment"
                                                className="max-h-[80vh] object-contain rounded"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <p className="text-sm text-muted-foreground">No proof uploaded</p>
                            )}
                        </div>
                    </div>

                    {request.payment.status === 'pending' && !isReadOnly && (
                        <div className="flex gap-2 pt-2">
                            <Button 
                                onClick={() => handlePaymentUpdate('verified')} 
                                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Verify Payment
                            </Button>
                            <Button 
                                onClick={() => handlePaymentUpdate('rejected')} 
                                variant="destructive"
                                className="w-full"
                            >
                                <X className="mr-2 h-4 w-4" /> Reject
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Request ${request.reference_number}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Show at top if pending - REMOVED */ }


                {/* Show if no payment - Added for Admin visibility */}


                <div className="flex flex-col gap-6">
                    {renderPaymentDetails()}
                    <div className="w-full space-y-6">
                        <Card className={
                        data.status === 'DEFICIENT' ? 'border-red-500 border-2 dark:border-red-700' : 
                        data.status === 'READY' ? 'border-green-500 border-2 dark:border-green-700' : 
                        data.status === 'CLAIMED' ? 'border-slate-500 border-2 dark:border-slate-700' : 
                        data.status === 'REJECTED' ? 'border-red-500 border-2 dark:border-red-700' : 
                        data.status === 'WAITING_FOR_PAYMENT' ? 'border-yellow-500 border-2 dark:border-yellow-700' : 
                        data.status === 'VERIFYING_PAYMENT' ? 'border-orange-500 border-2 dark:border-orange-700' : 
                        data.status === 'PROCESSING' ? 'border-blue-500 border-2 dark:border-blue-700' : ''
                    }>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-foreground">
                                    <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Request Details</CardTitle>
                                        <CardDescription>
                                            Detailed information about the student request.
                                        </CardDescription>
                                    </div>
                                </div>
                                {getStatusBadge(request.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground flex items-center gap-1.5"><IdCard className="h-3.5 w-3.5" /> Reference Number</Label>
                                    <p className="font-mono text-lg font-bold">{request.reference_number}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date Requested</Label>
                                    <p className="text-lg font-bold">{new Date(request.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold">Student Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Student Name</Label>
                                        <p className="font-bold text-xl">{request.student_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><IdCard className="h-3.5 w-3.5" /> Student ID</Label>
                                        <p className="font-bold text-xl">{request.student_id_number}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Course</Label>
                                        <p className="font-medium">{request.course || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                                        <p className="font-medium">{request.email || 'N/A'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Address</Label>
                                        <p className="font-medium">{request.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Birthdate</Label>
                                        <p className="font-medium">{request.birthdate || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Birthplace</Label>
                                        <p className="font-medium">{request.birthplace || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> High School</Label>
                                        <p className="font-medium">{request.higschool || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> High School Graduation Year</Label>
                                        <p className="font-medium">{request.hs_grad_year || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> Previous School</Label>
                                        <p className="font-medium">{request.prev_school || 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Requested Documents</h3>
                                </div>
                                <div className="border rounded-md overflow-hidden dark:border-border">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Document Type</TableHead>
                                                <TableHead className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="bg-card">
                                            {data.items && data.items.length > 0 ? (
                                                data.items.map((item: any) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="px-4 py-2 text-sm text-foreground">
                                                            <div>{item.document_type}</div>
                                                            {item.purpose && (
                                                                <div className="text-xs text-muted-foreground mt-1 italic">
                                                                    <span className="font-semibold not-italic">Purpose:</span> {item.purpose}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-2 text-sm text-muted-foreground text-right border-l align-top">
                                                            {data.status === 'PENDING' ? (
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <span>₱</span>
                                                                    <Input 
                                                                        type="number" 
                                                                        className="w-24 text-right h-8" 
                                                                        value={item.price}
                                                                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                `₱${Number(item.price).toFixed(2)}`
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell className="px-4 py-2 text-sm text-foreground">{request.document_type}</TableCell>
                                                    <TableCell className="px-4 py-2 text-sm text-muted-foreground text-right border-l">
                                                        ₱{request.amount_due}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow className="bg-muted/50 font-medium border-t">
                                                <TableCell className="px-4 py-2 text-sm text-foreground">Total</TableCell>
                                                <TableCell className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 text-right border-l font-bold">
                                                    ₱{data.items.reduce((sum: number, item: any) => sum + Number(item.price), 0).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Verification Section */}
                             {!request.payment && (data.status === 'PENDING' || data.status === 'WAITING_FOR_PAYMENT') && (
                                <div className="mt-6 p-4 rounded-md border-amber-400 dark:border-amber-600 border-dashed border-2 bg-amber-50 dark:bg-amber-900/20 flex flex-row items-center justify-between">
                                     <div className="flex flex-row items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                        <div>
                                            <h4 className="text-amber-900 dark:text-amber-200 font-semibold">
                                                {data.status === 'PENDING' ? 'Verification Required' : 'Waiting for Payment'}
                                            </h4>
                                            <p className="text-amber-700 dark:text-amber-300 text-sm">
                                                {data.status === 'PENDING' 
                                                    ? 'Please verify the documents and set the correct prices before proceeding.' 
                                                    : 'Waiting for student to upload payment proof.'}
                                            </p>
                                        </div>
                                     </div>
                                     {data.status === 'PENDING' && !isReadOnly && (
                                         <Button onClick={verifyAndSetPayment} className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600">
                                             Verify & Set Amount
                                         </Button>
                                     )}
                                </div>
                            )}
                        </CardContent>
                    </Card>


                </div>

                <div className="w-full space-y-6">
                    {/* Deficiency Card */}
                    {(() => {
                        const isDeficiencyDisabled = isReadOnly || (data.status !== 'PENDING' && data.status !== 'DEFICIENT');
                        return (
                            <Card className={`${data.status === 'DEFICIENT' ? 'border-red-500 border-2 dark:border-red-700' : ''} ${isDeficiencyDisabled ? 'bg-muted/50' : ''}`}>
                                <CardHeader className="flex flex-row items-center space-y-0 gap-3 pb-2">
                                    <Checkbox 
                                        id="has_deficiency" 
                                        checked={data.status === 'DEFICIENT'}
                                        disabled={isDeficiencyDisabled}
                                // Always enabled to allow reporting deficiencies at any stage
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        autoSave({ status: 'DEFICIENT', claiming_date: '' });
                                    } else {
                                        // Revert to previous appropriate status
                                        let newStatus: DocumentRequest['status'] = 'PENDING';
                                        if (request.payment) {
                                            if (request.payment.status === 'verified') newStatus = 'PROCESSING';
                                            else if (request.payment.status === 'pending') newStatus = 'VERIFYING_PAYMENT';
                                            else if (request.payment.status === 'rejected') newStatus = 'WAITING_FOR_PAYMENT';
                                        }
                                        autoSave({ status: newStatus, deficiency_remarks: '' });
                                    }
                                }}
                            />
                            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Has deficiency?</CardTitle>
                                <CardDescription>Check if documents are missing.</CardDescription>
                            </div>
                        </CardHeader>
                        {data.status === 'DEFICIENT' && (
                            <CardContent className="pt-0 animate-in slide-in-from-top-2 fade-in">
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-red-800 dark:text-red-300 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Deficiency Checklist
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                        {deficiencyOptions.map((option, index) => {
                                            const isSelected = selectedDeficiencies.includes(option);
                                            const checkboxId = `deficiency-${index}`;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`relative flex items-start space-x-3 p-3 border rounded-md transition-colors
                                                        ${isSelected 
                                                            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50' 
                                                            : 'hover:bg-muted/50 border-border'}
                                                        ${isReadOnly ? 'opacity-70' : 'cursor-pointer'}
                                                    `}
                                                    onClick={() => !isReadOnly && toggleDeficiency(option, !isSelected)}
                                                >
                                                    <Checkbox
                                                        id={checkboxId}
                                                        checked={isSelected}
                                                        disabled={isReadOnly}
                                                        onCheckedChange={(checked) => toggleDeficiency(option, checked as boolean)}
                                                        className="mt-1"
                                                        onClick={(e) => e.stopPropagation()} // Prevent double toggle
                                                    />
                                                    <Label
                                                        htmlFor={checkboxId}
                                                        className="text-sm leading-tight text-balance flex-1 cursor-pointer select-none"
                                                        onClick={(e) => e.stopPropagation()} // Let the div handle it or the label handle it
                                                    >
                                                        {option.includes(':') ? (
                                                            <>
                                                                <span className="font-bold">{option.split(':')[0]}:</span>
                                                                <span className="font-light italic text-muted-foreground ml-1">{option.split(':').slice(1).join(':')}</span>
                                                            </>
                                                        ) : (
                                                            <span className="font-medium">{option}</span>
                                                        )}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.deficiency_remarks && <p className="text-red-500 text-xs">{errors.deficiency_remarks}</p>}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                        );
                    })()}

                    {/* Ready for Pickup Card */}
                    {/* Ready for Pickup Card */}
                    <Card className={`${data.status === 'READY' ? 'border-green-500 border-2 dark:border-green-700' : ''} ${isActionsDisabled ? 'bg-muted/50' : ''}`}>
                        <CardHeader className="flex flex-row items-center space-y-0 gap-3 pb-3">
                            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Ready for pickup</CardTitle>
                                <CardDescription>Set a date for claiming.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="claiming_date">Claiming Date</Label>
                                <Input 
                                    id="claiming_date"
                                    type="date" 
                                    value={data.claiming_date}
                                    disabled={isActionsDisabled}
                                    onChange={(e) => {
                                        const date = e.target.value;
                                        autoSave({
                                            claiming_date: date,
                                            status: date ? 'READY' : (request.payment?.status === 'verified' ? 'PROCESSING' : 'PENDING'),
                                            deficiency_remarks: date ? '' : data.deficiency_remarks
                                        });
                                    }}
                                />
                                {errors.claiming_date && <p className="text-red-500 text-xs">{errors.claiming_date}</p>}
                            </div>
                        </CardContent>
                    </Card>


                    {data.status === 'PENDING' && !isReadOnly && (
                        <div>
                            <Button 
                                variant="destructive" 
                                className="w-full"
                                onClick={handleRejectRequest}
                            >
                                <X className="mr-2 h-4 w-4" /> Reject Request
                            </Button>
                        </div>
                    )}

                </div>
            </div>
            
            {/* request.payment check removed from here */}
            </div>
        </AppLayout>
    );
}
