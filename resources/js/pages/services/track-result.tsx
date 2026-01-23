import { Head, Link } from '@inertiajs/react';
import requestRoutes from '@/routes/request';
import { DocumentRequest } from '@/types/document-request';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, Info, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-md">
                                <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                    <User className="h-3 w-3" /> Student Name
                                </span>
                                <p className="text-sm font-medium text-gray-900">{request.student_name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                    <FileText className="h-3 w-3" /> Document
                                </span>
                                <p className="text-sm font-medium text-gray-900">{request.document_type}</p>
                            </div>
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
