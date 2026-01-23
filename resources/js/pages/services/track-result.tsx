import { Head, Link } from '@inertiajs/react';
import requestRoutes from '@/routes/request';

interface DocumentRequest {
    reference_number: string;
    student_name: string;
    document_type: string;
    status: 'PENDING' | 'PROCESSING' | 'DEFICIENT' | 'READY' | 'CLAIMED';
    deficiency_remarks?: string;
    claiming_date?: string;
    created_at: string;
}

export default function TrackResult({ request }: { request: DocumentRequest }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'DEFICIENT': return 'bg-red-100 text-red-800';
            case 'READY': return 'bg-green-100 text-green-800';
            case 'CLAIMED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Request Status" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                 <div className="text-center mb-6">
                    <Link
                        href={requestRoutes.track.url()}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        &larr; Check Another
                    </Link>
                </div>
                
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Request Details
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Reference: <span className="font-mono font-bold text-gray-700">{request.reference_number}</span>
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Student Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {request.student_name}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Document Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {request.document_type}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Status
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </span>
                                </dd>
                            </div>
                            
                            {request.status === 'DEFICIENT' && (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-red-50">
                                    <dt className="text-sm font-medium text-red-800">
                                        Deficiency Remarks
                                    </dt>
                                    <dd className="mt-1 text-sm text-red-900 sm:mt-0 sm:col-span-2">
                                        {request.deficiency_remarks}
                                    </dd>
                                </div>
                            )}

                            {request.status === 'READY' && request.claiming_date && (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-green-50">
                                    <dt className="text-sm font-medium text-green-800">
                                        Claiming Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-green-900 sm:mt-0 sm:col-span-2">
                                        {new Date(request.claiming_date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </dd>
                                </div>
                            )}
                             <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Date Requested
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                     {new Date(request.created_at).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
