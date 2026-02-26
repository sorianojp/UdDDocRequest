import { Head, useForm } from '@inertiajs/react';
import { DocumentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Info, Clock, AlertTriangle, CheckCircle, Upload, AlertCircle, Check, Circle, CreditCard, Loader2, ArrowRight, ClipboardList, ReceiptText, Send } from 'lucide-react';
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
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/50 via-background to-primary/50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Track ${request.reference_number}`} />

            <div className="mx-auto max-w-2xl space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary text-secondary-foreground rounded-full mb-2">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Request Tracking
                        </h1>
                        <p className="text-sm text-muted-foreground">
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
                                            isCompleted ? (isDeficient ? "border-red-600 bg-red-600 text-white" : "border-primary bg-primary text-primary-foreground") :
                                            isCurrent ? (isDeficient ? "border-red-600 text-red-600" : "border-primary text-primary ring-4 ring-primary/10") :
                                            "border-muted text-muted-foreground"
                                        )}>
                                            {isCompleted ? <Check className="h-4 w-4" /> :
                                             <span className="text-xs font-bold">{index + 1}</span>}
                                        </div>
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-max text-center">
                                            <span className={cn(
                                                "text-[10px] font-medium transition-colors duration-300 block",
                                                isCurrent ? "text-primary font-bold" : "text-muted-foreground"
                                            )}>
                                                {step.label}
                                            </span>
                                        </div>
                                    </div>

                                    {!isLast && (
                                        <div className="flex-1 h-1 mx-2 bg-muted relative rounded-full overflow-hidden">
                                            <div className={cn(
                                                    "absolute top-0 left-0 h-full w-full transition-all duration-500 origin-left",
                                                     isDeficient ? "bg-red-600" : "bg-primary",
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
                <Card className="overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4">
                            {request.status === 'PENDING' && <Loader2 className="h-10 w-10 text-primary animate-spin" />}
                            {request.status === 'WAITING_FOR_PAYMENT' && <CreditCard className="h-10 w-10 text-primary" />}
                            {request.status === 'VERIFYING_PAYMENT' && <Clock className="h-10 w-10 text-primary" />}
                            {request.status === 'PROCESSING' && <Loader2 className="h-10 w-10 text-primary animate-spin" />}
                            {request.status === 'READY' && <CheckCircle className="h-10 w-10 text-primary" />}
                            {request.status === 'CLAIMED' && <FileText className="h-10 w-10 text-muted-foreground" />}
                            {request.status === 'REJECTED' && <AlertTriangle className="h-10 w-10 text-red-500" />}
                            {request.status === 'DEFICIENT' && <AlertCircle className="h-10 w-10 text-red-500" />}
                        </div>
                        <CardTitle className="text-xl font-bold">
                            {request.status === 'PENDING' && 'Pending Verification'}
                            {request.status === 'WAITING_FOR_PAYMENT' && 'Payment Required'}
                            {request.status === 'VERIFYING_PAYMENT' && 'Verifying Payment'}
                            {request.status === 'PROCESSING' && 'Processing Request'}
                            {request.status === 'READY' && 'Ready for Pickup'}
                            {request.status === 'CLAIMED' && (
                                <div className="space-y-1">
                                    <p>Request Claimed!</p>
                                    <p className="text-xs font-normal text-muted-foreground">
                                        Claimed on {new Date(request.claimed_date!).toLocaleDateString('en-US', { 
                                            month: 'long', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            )}
                            {request.status === 'REJECTED' && 'Request Rejected'}
                            {request.status === 'DEFICIENT' && 'Deficiency Found'}
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {request.status === 'PENDING' && 'We have received your request and the Registrar is currently assessing the fees.'}
                            {request.status === 'WAITING_FOR_PAYMENT' && 'Your request has been assessed. Please proceed with the payment.'}
                            {request.status === 'VERIFYING_PAYMENT' && 'We are checking your payment proof. This usually takes 1-2 business days.'}
                            {request.status === 'PROCESSING' && 'Your documents are being prepared. We will notify you when it is ready.'}
                            {request.status === 'READY' && `Your documents are ready! You can claim them on ${new Date(request.claiming_date!).toLocaleDateString()}.`}
                            {request.status === 'DEFICIENT' && request.deficiency_remarks}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4 flex flex-col items-center gap-4">
                        {request.status === 'READY' && (
                             <Button 
                                size="lg" 
                                className="w-full sm:w-auto"
                                onClick={() => window.open(`/request/${request.reference_number}/print-stub`, '_blank')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Download Claim Stub
                            </Button>
                        )}
                        
                        {/* PAYMENT SECTION */}
                        {request.status === 'WAITING_FOR_PAYMENT' && (
                             <div className="w-full space-y-6">
                                <div className="bg-secondary/50 p-4 rounded-lg flex justify-between items-center border border-primary/10">
                                    <span className="text-sm font-medium">Amount Due</span>
                                    <span className="text-3xl font-bold text-primary">₱{Number(request.amount_due).toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-background p-4 rounded-lg border text-sm space-y-1">
                                        <p className="font-bold text-2xl uppercase tracking-wider text-red-800">BPI</p>
                                        <p className="font-mono text-base">0555233884</p>
                                        <p className="text-muted-foreground">Universidad de Dagupan, Inc.</p>
                                    </div>
                                    <div className="bg-background p-4 rounded-lg border text-sm space-y-1">
                                        <p className="font-bold text-2xl uppercase tracking-wider text-green-800">LAND BANK</p>
                                        <p className="font-mono text-base">0822108474</p>
                                        <p className="text-muted-foreground">Universidad de Dagupan, Inc.</p>
                                    </div>
                                </div>

                                {isPaymentRejected && (
                                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Previous proof was rejected. Please upload a new one.
                                    </div>
                                )}

                                <form onSubmit={submitPayment} className="space-y-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label htmlFor="reference_number">Bank Reference Number</Label>
                                        <Input
                                            id="reference_number"
                                            value={data.reference_number}
                                            onChange={(e) => setData('reference_number', e.target.value)}
                                            placeholder="Enter reference number"
                                            required
                                        />
                                        {errors.reference_number && <p className="text-red-500 text-xs">{errors.reference_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Payment Proof</Label>
                                        <Label 
                                            htmlFor="proof-upload" 
                                            className={cn(
                                                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-muted/20 hover:bg-muted/50",
                                                errors.proof ? "border-red-300" : "border-muted-foreground/25"
                                            )}
                                        >
                                            {preview ? (
                                                <div className="relative group/preview">
                                                     <img src={preview} alt="Preview" className="max-h-48 rounded-md shadow-sm" />
                                                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-md text-white font-medium text-xs">Change File</div>
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

                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? (
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                        ) : (
                                            <Send className="mr-2 h-4 w-4" />
                                        )}
                                        Submit Payment Proof
                                    </Button>
                                </form>
                             </div>
                        )}

                        {request.status === 'VERIFYING_PAYMENT' && request.payment && (
                            <div className="w-full space-y-3 mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-foreground mb-4">
                                    <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                        <ReceiptText className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Submitted Details</h3>
                                </div>
                                <div className="bg-secondary/30 rounded-lg p-4 border text-sm space-y-3">
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Bank Reference:</span>
                                        <span className="font-bold text-right truncate">{request.payment.reference_number}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Payment Proof:</span>
                                        <div className="text-right">
                                            <a href={`/storage/${request.payment.proof_file_path}`} target="_blank" className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline">
                                                <FileText className="h-4 w-4" />
                                                View Receipt
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* DETAILS CARD */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-foreground">
                            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg">Request Summary</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Student Name</p>
                                <p className="font-semibold text-foreground uppercase">{request.student_name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Student ID</p>
                                <p className="font-semibold text-foreground">{request.student_id_number}</p>
                            </div>
                        </div>
                        <Separator className="opacity-50" />
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-secondary/50 text-secondary-foreground text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-bold">Document</th>
                                        <th className="px-4 py-3 text-right font-bold">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-foreground font-medium">
                                    {request.items && request.items.length > 0 ? (
                                        request.items.map((item) => (
                                            <tr key={item.id} className="bg-background/50">
                                                <td className="px-4 py-3">{item.document_type}</td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(item.price) > 0 || request.status !== 'PENDING' ? `₱${Number(item.price).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="bg-background/50">
                                            <td className="px-4 py-3">{request.document_type}</td>
                                            <td className="px-4 py-3 text-right">
                                                {Number(request.amount_due) > 0 || request.status !== 'PENDING' ? `₱${Number(request.amount_due).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                            </td>
                                        </tr>
                                    )}
                                     <tr className="bg-secondary/20 font-bold border-t-2">
                                        <td className="px-4 py-3 text-right uppercase text-xs tracking-wider">Total Amount</td>
                                        <td className="px-4 py-3 text-right text-base text-primary">
                                            {Number(request.amount_due) > 0 || request.status !== 'PENDING' ? `₱${Number(request.amount_due).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <Separator className="opacity-50" />
                    <div className="p-4 bg-muted/20 text-center">
                         <p className="text-xs text-muted-foreground">Issues with your request? Contact the Registrar.</p>
                         <div className="flex justify-center gap-4 mt-2 text-xs font-medium">
                            <a href="mailto:registrar@udd.edu.ph" className="text-primary hover:underline transition-colors">registrar@udd.edu.ph</a>
                            <span className="text-muted-foreground/30">•</span>
                            <span>(075) 522-8295</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
