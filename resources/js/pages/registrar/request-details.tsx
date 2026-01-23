import AppLayout from '@/layouts/app-layout';
import registrar from '@/routes/registrar';
import { BreadcrumbItem, SharedData } from '@/types';
import { DocumentRequest } from '@/types/document-request';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function RequestDetails({
    request,
    school_id_url,
}: {
    request: DocumentRequest;
    school_id_url: string;
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
                                    <div>
                                        <Label className="text-muted-foreground">Document Requested</Label>
                                        <p className="font-medium flex items-center gap-2">
                                            {request.document_type}
                                        </p>
                                    </div>
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
                                        <Label htmlFor="deficiency_remarks" className="text-red-800 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" /> Deficiency Remarks
                                        </Label>
                                        <textarea
                                            id="deficiency_remarks"
                                            className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.deficiency_remarks}
                                            onChange={(e) => setData('deficiency_remarks', e.target.value)}
                                            placeholder="Enter what is missing..."
                                            required
                                        />
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
