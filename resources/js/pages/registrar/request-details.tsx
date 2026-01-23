import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import registrar from '@/routes/registrar';

interface DocumentRequest {
    id: number;
    reference_number: string;
    student_name: string;
    student_id_number: string;
    document_type: string;
    status: 'PENDING' | 'PROCESSING' | 'DEFICIENT' | 'READY' | 'CLAIMED';
    deficiency_remarks?: string;
    claiming_date?: string;
    school_id_path: string;
    created_at: string;
}

interface Props {
    request: DocumentRequest;
    school_id_url: string;
}

export default function RequestDetails({ request, school_id_url }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        status: request.status,
        deficiency_remarks: request.deficiency_remarks || '',
        claiming_date: request.claiming_date ? request.claiming_date.split(' ')[0] : '', // Format YYYY-MM-DD
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(registrar.update.url(request.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Registrar Dashboard',
                    href: registrar.index.url(),
                },
                {
                    title: `Request ${request.reference_number}`,
                    href: '#',
                },
            ]}
        >
            <Head title={`Request ${request.reference_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Request Details</h3>
                                <Link
                                    href={registrar.index.url()}
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    &larr; Back to Dashboard
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-4">Student Information</h4>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{request.student_name}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{request.student_id_number}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Document Type</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{request.document_type}</dd>
                                        </div>
                                         <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Date Requested</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{new Date(request.created_at).toLocaleString()}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Reference Number</dt>
                                            <dd className="mt-1 text-sm font-mono text-gray-900">{request.reference_number}</dd>
                                        </div>
                                    </dl>

                                    <div className="mt-8">
                                        <h4 className="text-md font-medium text-gray-700 mb-4">School ID Preview</h4>
                                        <div className="border rounded-md p-2">
                                            <img src={school_id_url} alt="School ID" className="max-w-full h-auto rounded" />
                                        </div>
                                        <div className="mt-2 text-right">
                                            <a href={school_id_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900">
                                                View Full Size
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-4">Process Request</h4>
                                    <form onSubmit={submit} className="space-y-6 bg-gray-50 p-6 rounded-md">
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                required
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value as any)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="DEFICIENT">DEFICIENT</option>
                                                <option value="READY">READY</option>
                                                <option value="CLAIMED">CLAIMED</option>
                                            </select>
                                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                                        </div>

                                        {data.status === 'DEFICIENT' && (
                                            <div>
                                                <label htmlFor="deficiency_remarks" className="block text-sm font-medium text-gray-700">
                                                    Deficiency Remarks
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="deficiency_remarks"
                                                        name="deficiency_remarks"
                                                        rows={3}
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="Describe the deficiency..."
                                                        value={data.deficiency_remarks}
                                                        onChange={(e) => setData('deficiency_remarks', e.target.value)}
                                                    />
                                                </div>
                                                {errors.deficiency_remarks && <p className="text-red-500 text-xs mt-1">{errors.deficiency_remarks}</p>}
                                            </div>
                                        )}

                                        {data.status === 'READY' && (
                                            <div>
                                                <label htmlFor="claiming_date" className="block text-sm font-medium text-gray-700">
                                                    Claiming Date
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="claiming_date"
                                                        id="claiming_date"
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        value={data.claiming_date}
                                                        onChange={(e) => setData('claiming_date', e.target.value)}
                                                    />
                                                </div>
                                                {errors.claiming_date && <p className="text-red-500 text-xs mt-1">{errors.claiming_date}</p>}
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                {processing ? 'Updating...' : 'Update Status'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
