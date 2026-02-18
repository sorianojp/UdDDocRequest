import { Head, useForm } from '@inertiajs/react';
import { DocumentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Info, Clock, AlertTriangle, CheckCircle, Upload, AlertCircle, Check, Circle, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FormEventHandler, useState, Fragment } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function TrackResult({ request }: { request: DocumentRequest }) {
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

    // Status Steps Logic
    const steps = [
        { id: 'submitted', label: 'Submitted', status: 'PENDING' },
        { id: 'payment', label: 'Payment', status: ['WAITING_FOR_PAYMENT', 'VERIFYING_PAYMENT', 'DEFICIENT'] },
        { id: 'processing', label: 'Processing', status: 'PROCESSING' },
        { id: 'ready', label: 'Ready', status: 'READY' },
        { id: 'claimed', label: 'Claimed', status: 'CLAIMED' },
    ];

    const getCurrentStepIndex = () => {
        if (request.status === 'PENDING') return 0;
        if (['WAITING_FOR_PAYMENT', 'VERIFYING_PAYMENT', 'DEFICIENT'].includes(request.status)) return 1;
        if (request.status === 'PROCESSING') return 2;
        if (request.status === 'READY') return 3;
        if (request.status === 'CLAIMED') return 4;
        if (request.status === 'REJECTED') return -1;
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Track ${request.reference_number}`} />

            <div className="mx-auto max-w-2xl space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Request Tracking
                        </h1>
                        <p className="text-muted-foreground">
                            Reference Number: <span className="font-mono font-medium text-foreground">{request.reference_number}</span>
                        </p>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="w-full max-w-2xl mx-auto mb-12 px-4">
                    <div className="flex items-center justify-between w-full relative">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const isLast = index === steps.length - 1;
                            const isDeficient = request.status === 'DEFICIENT';

                            return (
                                <Fragment key={step.id}>
                                    <div className="relative flex flex-col items-center group z-10">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background",
                                            isCompleted ? (isDeficient ? "border-red-600 bg-red-600 text-white" : "border-green-600 bg-green-600 text-white") :
                                            isCurrent ? (isDeficient ? "border-red-600 text-red-600 ring-4 ring-red-100" : "border-green-600 text-green-600 ring-4 ring-green-100") :
                                            "border-muted text-muted-foreground"
                                        )}>
                                            {isCompleted ? <Check className="h-4 w-4" /> :
                                             <span className="text-xs font-bold">{index + 1}</span>}
                                        </div>
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-max text-center">
                                            <span className={cn(
                                                "text-xs font-medium transition-colors duration-300 block",
                                                isCurrent ? (isDeficient ? "text-red-600 font-bold" : "text-green-600 font-bold") : "text-muted-foreground"
                                            )}>
                                                {step.label}
                                            </span>
                                        </div>
                                    </div>

                                    {!isLast && (
                                        <div className="flex-1 h-1 mx-2 bg-muted relative rounded-full overflow-hidden">
                                            <div className={cn(
                                                    "absolute top-0 left-0 h-full w-full transition-all duration-500 origin-left",
                                                     isDeficient ? "bg-red-600" : "bg-green-600",
                                                     isCompleted ? "scale-x-100" : "scale-x-0"
                                                )}
                                            />
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* HERO STATUS CARD */}
                <Card className="border-2 shadow-sm relative overflow-hidden">
                    {request.status === 'PENDING' && (
                        <div className="bg-blue-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'WAITING_FOR_PAYMENT' && (
                        <div className="bg-orange-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'VERIFYING_PAYMENT' && (
                        <div className="bg-amber-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'PROCESSING' && (
                        <div className="bg-indigo-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'DEFICIENT' && (
                        <div className="bg-red-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'READY' && (
                        <div className="bg-green-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'CLAIMED' && (
                        <div className="bg-slate-500/5 absolute inset-0 pointer-events-none" />
                    )}
                    {request.status === 'REJECTED' && (
                        <div className="bg-red-500/10 absolute inset-0 pointer-events-none" />
                    )}
                    
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4">
                            {request.status === 'PENDING' && <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />}
                            {request.status === 'WAITING_FOR_PAYMENT' && <CreditCard className="h-12 w-12 text-orange-500" />}
                            {request.status === 'VERIFYING_PAYMENT' && <Clock className="h-12 w-12 text-amber-500 animate-pulse" />}
                            {request.status === 'PROCESSING' && <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />}
                            {request.status === 'READY' && <CheckCircle className="h-12 w-12 text-green-500" />}
                            {request.status === 'CLAIMED' && <FileText className="h-12 w-12 text-slate-500" />}
                            {request.status === 'REJECTED' && <AlertTriangle className="h-12 w-12 text-red-500" />}
                            {request.status === 'DEFICIENT' && <AlertCircle className="h-12 w-12 text-red-500" />}
                        </div>
                        <CardTitle className={cn("text-2xl font-bold", 
                            request.status === 'PENDING' && "text-blue-700 dark:text-blue-400",
                            request.status === 'WAITING_FOR_PAYMENT' && "text-orange-700 dark:text-orange-400",
                            request.status === 'VERIFYING_PAYMENT' && "text-amber-700 dark:text-amber-400",
                            request.status === 'PROCESSING' && "text-indigo-700 dark:text-indigo-400",
                            request.status === 'READY' && "text-green-700 dark:text-green-400",
                            request.status === 'CLAIMED' && "text-slate-700 dark:text-slate-400",
                            request.status === 'REJECTED' && "text-red-700 dark:text-red-400",
                            request.status === 'DEFICIENT' && "text-red-700 dark:text-red-400"
                        )}>
                            {request.status === 'PENDING' && 'Pending Verification'}
                            {request.status === 'WAITING_FOR_PAYMENT' && 'Payment Required'}
                            {request.status === 'VERIFYING_PAYMENT' && 'Verifying Payment'}
                            {request.status === 'PROCESSING' && 'Processing Request'}
                            {request.status === 'READY' && 'Ready for Pickup'}
                            {request.status === 'CLAIMED' && 'Request Claimed!'}
                            {request.status === 'REJECTED' && 'Request Rejected'}
                            {request.status === 'DEFICIENT' && 'Deficiency Found'}
                        </CardTitle>
                        <CardDescription className="text-base max-w-lg mx-auto">
                            {request.status === 'PENDING' && 'We have received your request and the Registrar is currently assessing the fees. Please wait for the assessment.'}
                            {request.status === 'WAITING_FOR_PAYMENT' && 'Your request has been assessed. Please proceed with the payment to continue processing.'}
                            {request.status === 'VERIFYING_PAYMENT' && 'We are checking your payment proof. This usually takes 1-2 business days.'}
                            {request.status === 'PROCESSING' && 'Your documents are being prepared/printed. We will notify you when it is ready.'}
                            {request.status === 'READY' && `Your documents are ready! You can claim them at the Registrar's Office on ${new Date(request.claiming_date!).toLocaleDateString()}.`}
                            {request.status === 'DEFICIENT' && request.deficiency_remarks}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4 flex flex-col items-center gap-4">
                        {request.status === 'READY' && (
                             <Button 
                                size="lg" 
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => window.open(`/request/${request.reference_number}/print-stub`, '_blank')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Download Claim Stub
                            </Button>
                        )}
                        
                        {/* PAYMENT SECTION */}
                        {request.status === 'WAITING_FOR_PAYMENT' && (
                             <div className="w-full space-y-6 mt-4">
                                <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center border">
                                    <span className="font-medium">Amount Due</span>
                                    <span className="text-xl font-bold text-primary">₱{Number(request.amount_due).toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-card p-4 rounded-md border text-sm">
                                        <p className="font-bold text-red-600 mb-1">BPI</p>
                                        <p className="font-mono">0555233884</p>
                                        <p className="text-xs text-muted-foreground">Universidad de Dagupan, Inc.</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-md border text-sm">
                                        <p className="font-bold text-green-600 mb-1">LAND BANK</p>
                                        <p className="font-mono">0822108474</p>
                                        <p className="text-xs text-muted-foreground">Universidad de Dagupan, Inc.</p>
                                    </div>
                                </div>

                                {isPaymentRejected && (
                                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 text-red-800 text-sm flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Previous proof was rejected. Please upload a new one.
                                    </div>
                                )}

                                <form onSubmit={submitPayment} className="space-y-4 border-t pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="reference_number">Bank Reference Number</Label>
                                        <Input
                                            id="reference_number"
                                            value={data.reference_number}
                                            onChange={(e) => setData('reference_number', e.target.value)}
                                            placeholder="Enter reference number from receipt"
                                            required
                                        />
                                        {errors.reference_number && <p className="text-red-500 text-xs">{errors.reference_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Payment Proof (Screenshot/Photo)</Label>
                                        <Label 
                                            htmlFor="proof-upload" 
                                            className={cn(
                                                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-muted/20 hover:bg-muted/50",
                                                errors.proof ? "border-red-300" : "border-muted-foreground/25"
                                            )}
                                        >
                                            {preview ? (
                                                <div className="relative">
                                                     <img src={preview} alt="Preview" className="max-h-48 rounded-md shadow-sm" />
                                                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md text-white font-medium text-xs">Change File</div>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-2">
                                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                                                    <div className="text-sm font-medium text-primary">Click to upload image</div>
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

                                    <Button type="submit" disabled={processing} className="w-full" size="lg">
                                        {processing ? <Loader2 className="animate-spin mr-2" /> : null}
                                        Submit Payment Proof
                                    </Button>
                                </form>
                             </div>
                        )}

                        {request.status === 'VERIFYING_PAYMENT' && request.payment && (
                            <div className="w-full bg-muted/50 rounded-lg p-4 border space-y-2 mt-4">
                                <p className="text-sm font-medium text-center">Submitted Payment Details</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-muted-foreground">Reference:</span>
                                    <span className="font-mono text-right">{request.payment.reference_number}</span>
                                    <span className="text-muted-foreground">Proof:</span>
                                    <a href={`/storage/${request.payment.proof_file_path}`} target="_blank" className="text-primary hover:underline text-right truncate">View Image</a>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* DETAILS ACCORDION/CARD */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Request Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Student Name</p>
                                <p className="font-medium">{request.student_name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Student ID</p>
                                <p className="font-medium">{request.student_id_number}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Document</th>
                                        <th className="px-4 py-2 text-right font-medium">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {request.items && request.items.length > 0 ? (
                                        request.items.map((item) => (
                                            <tr key={item.id} className="bg-card">
                                                <td className="px-4 py-2">{item.document_type}</td>
                                                <td className="px-4 py-2 text-right">
                                                    {Number(item.price) > 0 ? `₱${Number(item.price).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="bg-card">
                                            <td className="px-4 py-2">{request.document_type}</td>
                                            <td className="px-4 py-2 text-right">
                                                {Number(request.amount_due) > 0 ? `₱${Number(request.amount_due).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                            </td>
                                        </tr>
                                    )}
                                     <tr className="bg-muted/20 font-medium">
                                        <td className="px-4 py-2 text-right">Total</td>
                                        <td className="px-4 py-2 text-right">
                                            {Number(request.amount_due) > 0 ? `₱${Number(request.amount_due).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* FOOTER */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>Issues with your request? Contact the Registrar.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <a href="mailto:registrar@udd.edu.ph" className="hover:text-primary transition-colors">registrar@udd.edu.ph</a>
                        <span>•</span>
                        <span>(075) 522-8295</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
