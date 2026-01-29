import { Head, useForm } from '@inertiajs/react';
import requestRoutes from '@/routes/request';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DocumentRequest, Payment } from '@/types';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';

interface Props {
    request: DocumentRequest & { payment?: Payment };
    amount: number;
}

export default function PaymentPage({ request, amount }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        proof: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
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
    const isPending = request.payment?.status === 'pending';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Payment" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Payment Required</CardTitle>
                        <CardDescription className="text-center">
                            Please upload your proof of payment to proceed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-center">
                            <p className="text-sm text-blue-600 mb-1">Amount Due</p>
                            <p className="text-3xl font-bold text-blue-800">₱{amount.toFixed(2)}</p>
                            <p className="text-xs text-blue-500 mt-1">{request.document_type}</p>
                            <p className="text-xs text-blue-500 font-mono mt-1">{request.reference_number}</p>
                        </div>

                        {isPaid ? (
                            <div className="text-center text-green-600 bg-green-50 p-6 rounded-lg border border-green-100">
                                <CheckCircle className="mx-auto h-12 w-12 mb-2" />
                                <h3 className="font-bold text-lg">Payment Verified!</h3>
                                <p className="text-sm">Your payment has been received and verified.</p>
                            </div>
                        ) : isPending ? (
                             <div className="text-center text-yellow-600 bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                                <AlertCircle className="mx-auto h-12 w-12 mb-2" />
                                <h3 className="font-bold text-lg">Payment Pending Verification</h3>
                                <p className="text-sm">We have received your proof of payment. Please wait for the registrar to verify it.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Upload Payment Receipt</Label>
                                    <label htmlFor="proof-upload" className="mt-1 flex flex-col items-center justify-center pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            {preview ? (
                                                <img src={preview} alt="Receipt Preview" className="mx-auto h-48 object-contain mb-4" />
                                            ) : (
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            )}
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>Upload a file</span>
                                                    <input id="proof-upload" name="proof" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </label>
                                    {errors.proof && <p className="text-red-500 text-xs">{errors.proof}</p>}
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Uploading...' : 'Submit Payment Proof'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="justify-center">
                       <a href={requestRoutes.track.url()} className="text-sm text-muted-foreground hover:underline">
                            Back to Tracking
                       </a>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
