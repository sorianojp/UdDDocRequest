import { Head, useForm } from '@inertiajs/react';
import { DocumentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Info, Clock, AlertTriangle, CheckCircle, Upload, AlertCircle, Check, Circle, CreditCard, Loader2, ArrowRight, ClipboardList, ReceiptText, Send, XCircle, User, IdCard, GraduationCap, Mail, MapPin, Building, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FormEventHandler, useState, Fragment } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
                            {request.status === 'CANCELLED' && <XCircle className="h-10 w-10 text-red-500" />}
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
                            {request.status === 'CANCELLED' && 'Request Cancelled'}
                            {request.status === 'DEFICIENT' && 'Deficiency Found'}
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {request.status === 'PENDING' && 'We have received your request and the Registrar is currently assessing the fees.'}
                            {request.status === 'WAITING_FOR_PAYMENT' && 'Your request has been assessed. Please proceed with the payment.'}
                            {request.status === 'VERIFYING_PAYMENT' && 'We are checking your payment proof. This usually takes 1-2 business days.'}
                            {request.status === 'PROCESSING' && 'Your documents are being prepared. We will notify you when it is ready.'}
                            {request.status === 'READY' && `Your documents are ready! You can claim them on ${new Date(request.claiming_date!).toLocaleDateString()}.`}
                            {request.status === 'DEFICIENT' && 'Please address the requirements below to proceed.'}
                            {request.status === 'CANCELLED' && 'This request has been cancelled.'}
                        </CardDescription>

                        {request.handler && (
                            <div className="mt-4 flex flex-col items-center justify-center gap-1 text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-6 py-3 rounded-2xl mx-auto w-fit border border-indigo-200 dark:border-indigo-800/50">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Handling Registrar: <strong className="font-semibold">{request.handler.name}</strong></span>
                                </div>
                                {request.handler.window && (
                                    <div className="flex items-center gap-1.5 text-sm bg-indigo-100/50 dark:bg-indigo-950/50 px-3 py-1 rounded-full mt-1">
                                        <Building className="h-3 w-3" />
                                        <span>Window: <strong className="font-semibold">{request.handler.window}</strong></span>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-4">
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

                        {request.status === 'PENDING' && (
                             <Button 
                                variant="destructive"
                                size="lg" 
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    if (confirm('Are you sure you want to cancel this request?')) {
                                        post(`/request/${request.id}/cancel`);
                                    }
                                }}
                                disabled={processing}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Request
                            </Button>
                        )}

                        {/* DEFICIENCY SECTION */}
                        {request.status === 'DEFICIENT' && request.deficiency_remarks && (
                            <div className="w-full space-y-4">
                                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4 text-red-800 dark:text-red-400">
                                        <AlertCircle className="h-5 w-5" />
                                        <h3 className="font-bold">Required Actions</h3>
                                    </div>
                                    
                                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-red-100 dark:border-red-900/20 shadow-sm">
                                        <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap leading-relaxed font-medium">
                                            {request.deficiency_remarks.replace(/\|/g, '\n').replace(/Remark: /g, '')}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-900/30">
                                        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 italic">
                                            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                            <p>Please coordinate with the Registrar's Office to resolve these deficiencies. Your request will remain on hold until cleared.</p>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        )}
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
                                    <h3 className="font-semibold">Submitted Details</h3>
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
                            <CardTitle>Request Details</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <FileText className="h-3 w-3" /> Tracking Number
                                    </p>
                                    <p className="font-mono font-bold text-primary">{request.reference_number}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" /> Date Requested
                                    </p>
                                    <p className="font-semibold text-foreground">
                                        {new Date(request.created_at).toLocaleDateString('en-US', { 
                                            month: 'long', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                            <Separator className="opacity-50" />
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                    <User className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold">Student Information</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <User className="h-3 w-3" /> Student Name
                                    </p>
                                    <p className="font-semibold text-foreground uppercase">{request.student_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <IdCard className="h-3 w-3" /> Student ID
                                    </p>
                                    <p className="font-semibold text-foreground">{request.student_id_number}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <GraduationCap className="h-3 w-3" /> Course
                                    </p>
                                    <p className="font-semibold text-foreground">{request.course || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <MapPin className="h-3 w-3" /> Address
                                    </p>
                                    <p className="font-semibold text-foreground">{request.address || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" /> Birthdate
                                    </p>
                                    <p className="font-semibold text-foreground">{request.birthdate || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <MapPin className="h-3 w-3" /> Birthplace
                                    </p>
                                    <p className="font-semibold text-foreground">{request.birthplace || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <Building className="h-3 w-3" /> High School
                                    </p>
                                    <p className="font-semibold text-foreground">{request.higschool || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" /> High School Graduation Year
                                    </p>
                                    <p className="font-semibold text-foreground">{request.hs_grad_year || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                                        <Building className="h-3 w-3" /> Previous School
                                    </p>
                                    <p className="font-semibold text-foreground">{request.prev_school || 'N/A'}</p>
                                </div>
                            </div>
                        <Separator className="opacity-50" />
                        <div className="rounded-lg border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-secondary/50 text-secondary-foreground text-xs uppercase tracking-wider">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 font-bold">Document Type</TableHead>
                                        <TableHead className="px-4 py-3 text-right font-bold">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y text-foreground font-medium">
                                    {request.items && request.items.length > 0 ? (
                                        request.items.map((item) => (
                                            <TableRow key={item.id} className="bg-background/50">
                                                <TableCell className="px-4 py-3">
                                                    <div className="font-bold">{item.document_type}</div>
                                                    {item.purpose && (
                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider shrink-0">Purpose</span>
                                                            <Badge variant="info" className="font-normal text-[11px] py-0.5 px-2 whitespace-normal h-auto leading-tight break-words max-w-[250px]">
                                                                {item.purpose}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-right align-top">
                                                    {Number(item.price) > 0 || request.status !== 'PENDING' ? `₱${Number(item.price).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow className="bg-background/50">
                                            <TableCell className="px-4 py-3">{request.document_type}</TableCell>
                                            <TableCell className="px-4 py-3 text-right">
                                                {Number(request.amount_due) > 0 || request.status !== 'PENDING' ? `₱${Number(request.amount_due).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                     <TableRow className="bg-secondary/20 font-bold border-t-2">
                                        <TableCell className="px-4 py-3 text-right uppercase text-xs tracking-wider">Total Amount</TableCell>
                                        <TableCell className="px-4 py-3 text-right text-base text-primary font-bold">
                                            {Number(request.amount_due) > 0 || request.status !== 'PENDING' ? `₱${Number(request.amount_due).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Computing...</span>}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <Separator className="opacity-50" />
                    <div className="p-4 bg-muted/20 text-center">
                         <p className="text-xs text-muted-foreground">Issues with your request? Contact the Registrar.</p>
                         <div className="flex justify-center gap-4 mt-2 text-xs font-medium">
                            <a href="mailto:info@cdd.edu.ph" className="text-primary hover:underline transition-colors">registrar@udd.edu.ph</a>
                            <span className="text-muted-foreground/30">•</span>
                            <span>(075) 523 2000</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
