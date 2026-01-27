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
            case 'PROCESSING':
                return <Badge variant="info">Processing</Badge>;
            case 'DEFICIENT':
                return <Badge variant="destructive">Deficient</Badge>;
            case 'READY':
                return <Badge variant="success">Ready to Claim</Badge>;
            case 'CLAIMED':
                return <Badge variant="outline">Claimed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-800';
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
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">Request Details</CardTitle>
                                        <CardDescription>
                                            Reference Number: <span className="font-mono font-medium text-gray-900">{request.reference_number}</span>
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
                                        <p className="text-sm text-green-700">
                                            You can claim your document on <strong>{new Date(request.claiming_date).toLocaleDateString()}</strong>.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment Status (Takes up 1 col) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Payment Status</CardTitle>
                                <CardDescription>Current status of your payment.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {request.payment ? (
                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-md border text-center ${
                                            request.payment.status === 'verified' ? 'bg-green-50 border-green-200 text-green-800' :
                                            request.payment.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' :
                                            'bg-blue-50 border-blue-200 text-blue-800'
                                        }`}>
                                            <div className="flex justify-center mb-2">
                                                {request.payment.status === 'verified' ? <CheckCircle2 className="h-8 w-8" /> :
                                                 request.payment.status === 'rejected' ? <AlertCircle className="h-8 w-8" /> :
                                                 <Clock className="h-8 w-8" />}
                                            </div>
                                            <p className="font-bold text-lg">{request.payment.status.charAt(0).toUpperCase() + request.payment.status.slice(1)}</p>
                                            {request.payment.external_reference_number && (
                                                <p className="text-sm text-gray-600 mt-1">Ref: <span className="font-mono font-medium">{request.payment.external_reference_number}</span></p>
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
                                    <div className="rounded-md">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h4 className="font-semibold text-blue-900 mb-2">GCash</h4>
                                                <div className="text-sm text-blue-800">
                                                    <p className="font-mono text-lg font-semibold">0927 360 0035</p>
                                                    <p className="text-xs opacity-75">John Paul Soriano</p>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                                <h4 className="font-semibold text-green-900 mb-2">Maya</h4>
                                                <div className="text-sm text-green-800">
                                                    <p className="font-mono text-lg font-semibold">0927 360 0035</p>
                                                    <p className="text-xs opacity-75">John Paul Soriano</p>
                                                </div>
                                            </div>
                                        </div>
                                        {isPaymentRejected && (
                                            <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2 text-red-800 text-sm mb-2">
                                                <AlertCircle className="h-4 w-4" />
                                                <p>Previous payment was rejected. Please upload a new proof.</p>
                                            </div>
                                        )}
                                        <form onSubmit={submitPayment} className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="reference_number">Reference Number</Label>
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
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
                 Submitted on {new Date(request.created_at).toLocaleDateString()}
            </div>
        </div>
    );
}
