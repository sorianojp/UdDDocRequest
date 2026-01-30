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
import { AlertTriangle, Calendar, CheckCircle, Clock, Plus, X, ExternalLink, Save, Eye } from 'lucide-react';

export default function RequestDetails({
    request,
    school_id_url,
    deficiencies,
}: {
    request: DocumentRequest;
    school_id_url: string;
    deficiencies: string[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        status: request.status,
        deficiency_remarks: request.deficiency_remarks || '',
        claiming_date: request.claiming_date ? request.claiming_date.split('T')[0] : '',
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
        return data.deficiency_remarks.split(',').map((s: string) => s.trim()).filter(Boolean);
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
        const newRemarks = current.join(', ');
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
                    setData('status', 'REJECTED');
                }
            }
        });
    };

    // Derived state for formatting
    const selectedDeficiencies = getSelectedDeficiencies();
    
    // Status Badge Helper
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
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
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };
    
    // Disable actions if payment is pending or rejected
    const isActionsDisabled = request.payment && (request.payment.status === 'pending' || request.payment.status === 'rejected');

    const renderPaymentDetails = () => (
        request.payment && (
            <Card className={
                request.payment.status === 'rejected' ? 'border-red-500 border-2' : 
                request.payment.status === 'verified' ? 'border-green-500 border-2' : ''
            }>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>Payment information and proof.</CardDescription>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                        <div>
                            <Label className="text-muted-foreground">Amount</Label>
                            <p className="font-medium">₱{request.payment.amount}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Reference</Label>
                            <p className="font-mono text-sm">{request.payment.reference_number}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Ext. Ref</Label>
                            <p className="font-mono text-sm font-medium">{request.payment.external_reference_number}</p>
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
                                                Reference: {request.payment.external_reference_number}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={`/storage/${request.payment.proof_file_path}`}
                                                alt="Proof of Payment"
                                                className="max-h-[80vh] object-contain rounded"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <p className="text-sm text-gray-500">No proof uploaded</p>
                            )}
                        </div>
                    </div>

                    {request.payment.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                            <Button 
                                onClick={() => handlePaymentUpdate('verified')} 
                                className="w-full bg-green-600 hover:bg-green-700"
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
                {/* Show at top if pending */}
                {request.payment && request.payment.status === 'pending' && renderPaymentDetails()}

                <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 space-y-6">
                    <Card className={
                        data.status === 'DEFICIENT' ? 'border-red-500 border-2' : 
                        data.status === 'READY' ? 'border-green-500 border-2' : 
                        data.status === 'CLAIMED' ? 'border-slate-500 border-2' : 
                        data.status === 'REJECTED' ? 'border-red-500 border-2' : 
                        data.status === 'PROCESSING' ? 'border-blue-500 border-2' : ''
                    }>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Request Details</CardTitle>
                                    <CardDescription>
                                        Detailed information about the student request.
                                    </CardDescription>
                                </div>
                                {getStatusBadge(request.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Reference Number</Label>
                                    <p className="font-mono text-lg font-medium">{request.reference_number}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Date Requested</Label>
                                    <p className="text-lg">{new Date(request.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-semibold">Student Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <Label className="text-muted-foreground">Student Name</Label>
                                        <p className="font-medium">{request.student_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Student ID</Label>
                                        <p className="font-medium">{request.student_id_number}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Email</Label>
                                        <p className="font-medium">{request.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">School ID</Label>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full mt-1">
                                                    <Eye className="mr-2 h-4 w-4" /> View ID
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>School ID Verification</DialogTitle>
                                                    <DialogDescription>
                                                        Student ID: {request.student_id_number}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={school_id_url}
                                                        alt="Student School ID"
                                                        className="max-h-[80vh] object-contain rounded"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <h3 className="font-semibold">Requested Documents</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {request.items && request.items.length > 0 ? (
                                                request.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.document_type}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-500 text-right">₱{item.price}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{request.document_type}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500 text-right">
                                                        ₱{request.amount_due}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="bg-gray-50 font-medium">
                                                <td className="px-4 py-2 text-sm text-gray-900">Total</td>
                                                <td className="px-4 py-2 text-sm text-indigo-600 text-right">₱{request.amount_due}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>

                <div className="w-full md:w-1/3 space-y-6">
                    {/* Deficiency Card */}
                    {/* Deficiency Card */}
                    <Card className={`${data.status === 'DEFICIENT' ? 'border-red-500 border-2' : ''} ${isActionsDisabled ? 'bg-gray-100' : ''}`}>
                        <CardHeader className="flex flex-row items-center space-y-0 gap-3 pb-2">
                            <Checkbox 
                                id="has_deficiency" 
                                checked={data.status === 'DEFICIENT'}
                                disabled={isActionsDisabled}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        autoSave({ status: 'DEFICIENT', claiming_date: '' });
                                    } else {
                                        const newStatus = request.payment?.status === 'verified' ? 'PROCESSING' : 'PENDING';
                                        autoSave({ status: newStatus, deficiency_remarks: '' });
                                    }
                                }}
                            />
                            <div>
                                <CardTitle>Has deficiency?</CardTitle>
                                <CardDescription>Check if documents are missing.</CardDescription>
                            </div>
                        </CardHeader>
                        {data.status === 'DEFICIENT' && (
                            <CardContent className="pt-0 animate-in slide-in-from-top-2 fade-in">
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-red-800 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Deficiency Checklist
                                    </Label>
                                    <div className="space-y-2">
                                        {deficiencyOptions.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`deficiency-${option}`}
                                                    checked={selectedDeficiencies.includes(option)}
                                                    disabled={isActionsDisabled}
                                                    onCheckedChange={(checked) => toggleDeficiency(option, checked as boolean)}
                                                />
                                                <label
                                                    htmlFor={`deficiency-${option}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.deficiency_remarks && <p className="text-red-500 text-xs">{errors.deficiency_remarks}</p>}
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Ready for Pickup Card */}
                    {/* Ready for Pickup Card */}
                    <Card className={`${data.status === 'READY' ? 'border-green-500 border-2' : ''} ${isActionsDisabled ? 'bg-gray-100' : ''}`}>
                        <CardHeader className="pb-3">
                            <CardTitle>Ready for pickup</CardTitle>
                            <CardDescription>Set a date for claiming.</CardDescription>
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

                    {/* Claimed Card */}
                    {/* Claimed Card */}
                    <Card className={`${data.status === 'CLAIMED' ? 'border-slate-500 border-2' : ''} ${isActionsDisabled ? 'bg-gray-100' : ''}`}>
                        <CardHeader className="pb-3">
                            <CardTitle>Claimed?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                variant={data.status === 'CLAIMED' ? 'secondary' : 'outline'}
                                className="w-full"
                                onClick={() => autoSave({ status: 'CLAIMED' })}
                                disabled={data.status === 'CLAIMED' || isActionsDisabled}
                            >
                                {data.status === 'CLAIMED' ? 'Status: Claimed' : 'Mark as Claimed'}
                            </Button>
                            {data.status === 'CLAIMED' && request.claimed_date && (
                                <p className="text-sm text-center text-slate-600 mt-2">
                                    Claimed on: <span className="font-medium">{new Date(request.claimed_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </p>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
            
            {request.payment && request.payment.status !== 'pending' && renderPaymentDetails()}
            </div>
        </AppLayout>
    );
}
