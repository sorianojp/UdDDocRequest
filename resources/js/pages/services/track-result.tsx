import { Head, Link, useForm } from '@inertiajs/react';
import requestRoutes from '@/routes/request';
import { DocumentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, Info, Clock, AlertTriangle, CheckCircle, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FormEventHandler, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function TrackResult({ request }: { request: DocumentRequest }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
            case 'WAITING_FOR_PAYMENT':
                return <Badge variant="warning">Waiting Payment</Badge>;
            case 'VERIFYING_PAYMENT':
                return <Badge variant="orange">Verifying Payment</Badge>;
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-800';
            case 'WAITING_FOR_PAYMENT': return 'bg-orange-100 text-orange-800';
            case 'VERIFYING_PAYMENT': return 'bg-amber-100 text-amber-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'DEFICIENT': return 'bg-red-100 text-red-800';
            case 'READY': return 'bg-green-100 text-green-800';
            case 'CLAIMED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Payment Logic
    const { data, setData, post, processing, errors } = useForm({
        proof: null as File | null,
        reference_number: '',
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submitPayment: FormEventHandler = (e) => {
        e.preventDefault();
        // @ts-ignore
        post(`/requests/${request.id}/payment`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('proof', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const isPaid = request.payment?.status === 'verified';
    const isPaymentPending = request.payment?.status === 'pending';
    const isPaymentRejected = request.payment?.status === 'rejected';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Tracking Result" />

            <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Request Details */}
                    <div className="space-y-6">
                        <Card className={
                            request.status === 'PENDING' ? 'border-gray-500 border-2' : 
                            request.status === 'WAITING_FOR_PAYMENT' ? 'border-yellow-500 border-2' : 
                            request.status === 'VERIFYING_PAYMENT' ? 'border-orange-500 border-2' : 
                            request.status === 'DEFICIENT' ? 'border-red-500 border-2' : 
                            request.status === 'READY' ? 'border-green-500 border-2' : 
                            request.status === 'CLAIMED' ? 'border-slate-500 border-2' : 
                            request.status === 'REJECTED' ? 'border-red-500 border-2' : 
                            request.status === 'PROCESSING' ? 'border-blue-500 border-2' : ''
                        }>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Request Details</CardTitle>
                                        <CardDescription>
                                            Detailed information about your request.
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Student Name</p>
                                        <p className="font-medium">{request.student_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Student ID</p>
                                        <p className="font-medium">{request.student_id_number}</p>
                                    </div>
                                    {request.email && (
                                        <div className="md:col-span-2">
                                            <p className="text-gray-500">Email</p>
                                            <p className="font-medium">{request.email}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-medium mb-3">Requested Documents</h4>
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {request.items && request.items.length > 0 ? (
                                                    request.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-4 py-3 text-sm text-gray-900">{item.document_type}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right">₱{Number(item.price).toFixed(2)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{request.document_type}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">₱{Number(request.amount_due).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                <tr className="bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Total Amount</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">₱{Number(request.amount_due).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {request.deficiency_remarks && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">Deficiency Remarks</h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>{request.deficiency_remarks}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {request.status === 'READY' && request.claiming_date && (
                                    <div className="bg-green-50 p-4 rounded-md border border-green-200">
                                        <h4 className="flex items-center text-sm font-medium text-green-800 mb-2">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Ready for Pickup
                                        </h4>
                                        <p className="text-sm text-green-700 mb-3">
                                            You can claim your document on <strong>{new Date(request.claiming_date).toLocaleDateString()}</strong>.
                                        </p>
                                        <Button 
                                            size="sm" 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => window.open(`/request/${request.reference_number}/print-stub`, '_blank')}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Print Claim Stub
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment Status (Takes up 1 col) */}
                    <div className="space-y-6">
                        <Card className="bg-blue-50 border-blue-200 border-2 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Reference Number</h3>
                                        <p className="text-3xl sm:text-4xl font-mono font-bold text-blue-900 tracking-widest select-all">
                                            {request.reference_number}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-blue-800 bg-blue-100/50 p-3 rounded-md mx-auto max-w-md">
                                        <div className="bg-blue-200 p-1 rounded-full">
                                            <Info className="w-4 h-4 text-blue-800" />
                                        </div>
                                        <span className="font-medium">Please save this number or take a screenshot for tracking purposes.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={
                            request.payment && (
                                request.payment.status === 'verified' ? 'border-green-500 border-2' : 
                                request.payment.status === 'rejected' ? 'border-red-500 border-2' : ''
                            )
                        }>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Payment Status</CardTitle>
                                        <CardDescription>Current status of your payment.</CardDescription>
                                    </div>
                                    {request.payment && (
                                        <Badge variant={
                                            request.payment.status === 'verified' ? 'success' : 
                                            request.payment.status === 'rejected' ? 'destructive' : 'secondary'
                                        }>
                                            {request.payment.status.charAt(0).toUpperCase() + request.payment.status.slice(1)}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {request.payment && request.status !== 'WAITING_FOR_PAYMENT' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-md border text-center bg-gray-50 border-gray-200">
                                            {request.payment.reference_number ? (
                                                <>
                                                    <Label className="text-muted-foreground block mb-1">Bank Reference No.</Label>
                                                    <p className="font-mono font-medium text-lg">{request.payment.reference_number}</p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500 italic">No reference number</p>
                                            )}
                                        </div>

                                        {request.payment.proof_file_path && (
                                            <div>
                                                <Label>Proof of Payment</Label>
                                                <div className="mt-2 border rounded-md p-2 bg-gray-50">
                                                    <a href={`/storage/${request.payment.proof_file_path}`} target="_blank" rel="noopener noreferrer" className="block relative aspect-video overflow-hidden rounded-md">
                                                        <img 
                                                            src={`/storage/${request.payment.proof_file_path}`} 
                                                            alt="Proof of Payment" 
                                                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                                            <span className="sr-only">View full size</span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Show upload form if no payment OR if status is WAITING_FOR_PAYMENT (re-upload)
                                    (request.status === 'WAITING_FOR_PAYMENT') ? (
                                    <div className="rounded-md">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-red-50 p-4 rounded-md border border-red-100">
                                                <h4 className="font-semibold text-red-900 mb-2">BPI</h4>
                                                <div className="text-sm text-red-800">
                                                    <p className="font-mono text-lg font-semibold">0555233884</p>
                                                    <p className="text-xs opacity-75">UNIVERSIDAD DE DAGUPAN, INC.</p>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                                <h4 className="font-semibold text-green-900 mb-2">LAND BANK</h4>
                                                <div className="text-sm text-green-800">
                                                    <p className="font-mono text-lg font-semibold">0822108474</p>
                                                    <p className="text-xs opacity-75">UNIVERSIDAD DE DAGUPAN, INC.</p>
                                                </div>
                                            </div>
                                        </div>
                                        {isPaymentRejected && (
                                            <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2 text-red-800 text-sm mb-2 mt-4">
                                                <AlertCircle className="h-4 w-4" />
                                                <p>Previous payment was rejected. Please upload a new proof.</p>
                                            </div>
                                        )}
                                        <form onSubmit={submitPayment} className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="reference_number">Bank Reference Number</Label>
                                                <Input
                                                    id="reference_number"
                                                    value={data.reference_number}
                                                    onChange={(e) => setData('reference_number', e.target.value)}
                                                    placeholder="Enter payment reference number"
                                                    required
                                                />
                                                {errors.reference_number && <p className="text-red-500 text-xs">{errors.reference_number}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="proof-upload" className="text-sm font-medium">Upload Proof of Payment</Label>
                                                <Label 
                                                    htmlFor="proof-upload" 
                                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer bg-white"
                                                >
                                                    {preview ? (
                                                         <div className="text-center w-full">
                                                            <img src={preview} alt="Preview" className="mx-auto max-h-48 object-contain rounded-md mb-2" />
                                                            <span className="text-xs text-indigo-600 font-medium">Click to change file</span>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1 text-center py-4">
                                                            <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium text-indigo-600">Click to upload</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">Image files only</p>
                                                        </div>
                                                    )}
                                                    <input 
                                                        id="proof-upload" 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </Label>
                                                {errors.proof && <p className="text-red-500 text-xs">{errors.proof}</p>}
                                            </div>
                                            <Button type="submit" disabled={processing} className="w-full">
                                                {processing ? 'Uploading...' : 'Submit Payment Proof'}
                                            </Button>
                                        </form>
                                    </div>
                                    ) : (
                                        <div className="bg-amber-50 p-6 rounded-md border border-amber-200 text-center space-y-3">
                                            <Clock className="h-12 w-12 text-amber-500 mx-auto" />
                                            <h4 className="text-lg font-medium text-amber-900">Waiting for Verification</h4>
                                            <p className="text-amber-800">
                                                Your request is currently being verified by the Registrar's Office. 
                                                Once verified, the total amount will be computed and you will be able to upload your payment proof here.
                                            </p>
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
                 Submitted on {new Date(request.created_at).toLocaleDateString()}
            </div>

            <div className="mt-8 border-t pt-8 pb-4">
                <div className="text-center space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Registrar's Office Contact Information</h3>
                    <div className="text-sm text-gray-600">
                        <p className="mt-1">
                            Email: <a href="mailto:registrar@udd.edu.ph" className="text-blue-600 hover:text-blue-500">registrar@udd.edu.ph</a>
                        </p>
                        <p>
                            Phone: <span className="font-medium">(075) 522-8295</span>
                        </p>
                        <p>Universidad de Dagupan</p>
                        <p>Arellano St., Dagupan City</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
