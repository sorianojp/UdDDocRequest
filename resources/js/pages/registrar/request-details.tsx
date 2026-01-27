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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calendar, CheckCircle, Clock, Plus, X } from 'lucide-react';

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(registrar.update.url(request.id));
    };
    
    // Sort deficiencies alphabetically or by ID as needed, but standard ones first?
    // For now, simple list.
    const deficiencyOptions = deficiencies;

    const getSelectedDeficiencies = (): string[] => {
        if (!data.deficiency_remarks) return [];
        return data.deficiency_remarks.split(',').map((s: string) => s.trim()).filter(Boolean);
    };

    const toggleDeficiency = (option: string, checked: boolean) => {
        let current = getSelectedDeficiencies();
        if (checked) {
            if (!current.includes(option)) current.push(option);
        } else {
            current = current.filter((item: string) => item !== option);
        }
        setData('deficiency_remarks', current.join(', '));
    };
    

    const handlePaymentUpdate = (status: 'verified' | 'rejected') => {
        if (!request.payment) return;
        router.put(`/registrar/payments/${request.payment.id}`, { status }, {
            onSuccess: () => {
                // Toast handled by flash message
            }
        });
    };

    // Derived state for formatting
    const selectedDeficiencies = getSelectedDeficiencies();


    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
            case 'PROCESSING':
                return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>;
            case 'DEFICIENT':
                return <Badge variant="destructive">Deficient</Badge>;
            case 'READY':
                return <Badge className="bg-green-500 hover:bg-green-600">Ready</Badge>;
            case 'CLAIMED':
                return <Badge variant="outline">Claimed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Request ${request.reference_number}`} />

            <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="w-full md:w-2/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">Request Details</CardTitle>
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
                                <h3 className="font-medium">Student Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <Label className="text-muted-foreground">Student Name</Label>
                                        <p className="font-medium">{request.student_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Student ID</Label>
                                        <p className="font-medium">{request.student_id_number}</p>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <h3 className="font-medium">Requested Documents</h3>
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

                    <Card>
                         <CardHeader>
                            <CardTitle className="text-lg">School ID Verification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg p-2 bg-gray-50 flex justify-center">
                                <img
                                    src={school_id_url}
                                    alt="Student School ID"
                                    className="max-h-96 object-contain rounded"
                                />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <a href={school_id_url} target="_blank" rel="noreferrer">
                                    <Button variant="outline" size="sm">
                                        Open Full Image
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {request.payment && (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">Payment Details</CardTitle>
                                        <CardDescription>Payment information and proof.</CardDescription>
                                    </div>
                                    <Badge variant={
                                        request.payment.status === 'verified' ? 'outline' : 
                                        request.payment.status === 'rejected' ? 'destructive' : 'secondary'
                                    } className={request.payment.status === 'verified' ? 'bg-green-100 text-green-800' : ''}>
                                        {request.payment.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Amount</Label>
                                        <p className="font-medium">₱{request.payment.amount}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Reference</Label>
                                        <p className="font-mono text-sm">{request.payment.reference_number}</p>
                                    </div>
                                </div>

                                {request.payment.proof_file_path && (
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Proof of Payment</Label>
                                        <div className="border rounded-lg p-2 bg-gray-50 flex justify-center">
                                            <a href={`/storage/${request.payment.proof_file_path}`} target="_blank" rel="noreferrer">
                                                <img
                                                    src={`/storage/${request.payment.proof_file_path}`}
                                                    alt="Proof of Payment"
                                                    className="max-h-64 object-contain rounded hover:opacity-90 transition-opacity cursor-pointer"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                )}

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
                    )}
                </div>

                <div className="w-full md:w-1/3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Update Status</CardTitle>
                             <CardDescription>Process this request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Current Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as DocumentRequest['status'])}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="PROCESSING">Processing</SelectItem>
                                            <SelectItem value="DEFICIENT">Deficient (Require Info)</SelectItem>
                                            <SelectItem value="READY">Ready for Pickup</SelectItem>
                                            <SelectItem value="CLAIMED">Claimed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                     {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
                                </div>

                                {data.status === 'DEFICIENT' && (
                                    <div className="space-y-2 p-3 bg-red-50 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-red-800 flex items-center gap-1 mb-2">
                                            <AlertTriangle className="h-3 w-3" /> Deficiency Checklist
                                        </Label>
                                        
                                        <div className="space-y-2">
                                            {deficiencyOptions.map((option) => (
                                                <div key={option} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`deficiency-${option}`}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={selectedDeficiencies.includes(option)}
                                                        onChange={(e) => toggleDeficiency(option, e.target.checked)}
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
                                )}

                                {data.status === 'READY' && (
                                    <div className="space-y-2 p-3 bg-green-50 rounded-md border border-green-100 animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="claiming_date" className="text-green-800 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Claiming Date
                                        </Label>
                                        <Input
                                            id="claiming_date"
                                            type="date"
                                            value={data.claiming_date}
                                            onChange={(e) => setData('claiming_date', e.target.value)}
                                            required
                                        />
                                         {errors.claiming_date && <p className="text-red-500 text-xs">{errors.claiming_date}</p>}
                                    </div>
                                )}

                                <Button type="submit" disabled={processing} className="w-full mt-4">
                                    {processing ? 'Saving...' : 'Update Status'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
