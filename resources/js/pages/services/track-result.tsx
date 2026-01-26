import { Head, Link, useForm } from '@inertiajs/react';
import requestRoutes from '@/routes/request';
import { DocumentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, Info, Clock, AlertTriangle, CheckCircle, Upload, AlertCircle } from 'lucide-react';
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
                return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>;
            case 'DEFICIENT':
                return <Badge variant="destructive">Deficient</Badge>;
            case 'READY':
                return <Badge className="bg-green-500 hover:bg-green-600">Ready to Claim</Badge>;
            case 'CLAIMED':
                return <Badge variant="outline">Claimed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // Payment Logic
    const { data, setData, post, processing, errors } = useForm({
        proof: null as File | null,
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

            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <Card>
                    <CardHeader className="text-center">
                        <CardDescription>Reference Number</CardDescription>
                        <CardTitle className="text-2xl font-mono text-indigo-600">{request.reference_number}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Info className="h-4 w-4" /> Status
                            </span>
                            {getStatusBadge(request.status)}
                        </div>

                        {request.status === 'DEFICIENT' && (
                            <div className="bg-red-50 p-4 rounded-md border border-red-200">
                                <h4 className="flex items-center text-sm font-medium text-red-800 mb-2">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Requirements Needed
                                </h4>
                                <p className="text-sm text-red-700">{request.deficiency_remarks}</p>
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

                        <div className="bg-gray-50 p-3 rounded-md mb-4">
                            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                <User className="h-3 w-3" /> Student Name
                            </span>
                            <p className="text-sm font-medium text-gray-900">{request.student_name}</p>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Requested Documents
                            </h4>
                            <div className="border rounded-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
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

                        <Separator />

                        {/* Payment Section */}
                        <div className="space-y-4 pt-2">
                             <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Payment Status</h3>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Amount Due</p>
                                    <p className="font-bold text-indigo-600">₱{request.amount_due.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            {isPaid ? (
                                <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-green-800">Payment Verified</h4>
                                        <p className="text-xs text-green-700 mt-1">
                                            Reference: <span className="font-mono">{request.payment?.reference_number}</span>
                                        </p>
                                    </div>
                                </div>
                            ) : isPaymentPending ? (
                                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-yellow-800">Payment Pending Verification</h4>
                                        <p className="text-xs text-yellow-700 mt-1">
                                            We are reviewing your proof of payment.
                                            <br />Reference: <span className="font-mono">{request.payment?.reference_number}</span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 border rounded-md p-4 bg-gray-50/50">
                                    {isPaymentRejected && (
                                        <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2 text-red-800 text-sm mb-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Your previous payment was rejected. Please upload a new proof.
                                        </div>
                                    )}
                                    
                                    <form onSubmit={submitPayment} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="proof-upload" className="text-sm font-medium">Upload Proof of Payment</Label>
                                            <Label 
                                                htmlFor="proof-upload" 
                                                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:bg-white transition-colors cursor-pointer bg-white"
                                            >
                                                {preview ? (
                                                     <div className="text-center w-full">
                                                        <img src={preview} alt="Receipt Preview" className="mx-auto h-32 object-contain mb-2 rounded" />
                                                        <span className="text-xs text-blue-600">Click to change</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-600">Click to upload image</span>
                                                    </div>
                                                )}
                                                <Input 
                                                    id="proof-upload" 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={handleFileChange} 
                                                    accept="image/*"
                                                />
                                            </Label>
                                            {errors.proof && <p className="text-red-500 text-xs">{errors.proof}</p>}
                                        </div>

                                        <Button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                            {processing ? 'Uploading...' : 'Submit Payment Proof'}
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                        
                        <Separator />
                        
                        <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" />
                            Submitted on {new Date(request.created_at).toLocaleDateString()}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3">
                         <a href={requestRoutes.track.url()} className="w-full">
                            <Button variant="secondary" className="w-full">Track Another Request</Button>
                        </a>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
