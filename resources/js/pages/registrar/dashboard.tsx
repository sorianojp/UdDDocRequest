import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import registrar from '@/routes/registrar';

interface DocumentRequest {
    id: number;
    reference_number: string;
    student_name: string;
    document_type: string;
    status: string;
    created_at: string;
}

interface Props {
    requests: {
        data: DocumentRequest[];
        links: any[];
    };
    filters: {
        status?: string;
    };
}

export default function RegistrarDashboard({ requests, filters }: Props) {
    const handleStatusFilter = (status: string) => {
        router.get(registrar.index.url(), { status }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Registrar Dashboard',
                    href: registrar.index.url(),
                },
            ]}
        >
            <Head title="Registrar Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Document Requests</h3>
                                <div className="flex space-x-2">
                                    {['ALL', 'PENDING', 'PROCESSING', 'DEFICIENT', 'READY', 'CLAIMED'].map((status) => (
                                         <button
                                            key={status}
                                            onClick={() => handleStatusFilter(status === 'ALL' ? '' : status)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                (filters.status === status) || (!filters.status && status === 'ALL')
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ref No.
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Document
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">View</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.data.map((req) => (
                                            <tr key={req.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {req.reference_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {req.student_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {req.document_type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        req.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                                        req.status === 'DEFICIENT' ? 'bg-red-100 text-red-800' :
                                                        req.status === 'READY' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={registrar.show.url(req.id)} className="text-indigo-600 hover:text-indigo-900">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {requests.data.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No requests found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
