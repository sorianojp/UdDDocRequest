import AppLayout from '@/layouts/app-layout';
import registrar from '@/routes/registrar';
import { BreadcrumbItem, DocumentRequest, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, FileText, Filter } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Requests',
        href: '/registrar/requests',
    },
];

export default function RegistrarDashboard({
    requests,
    filters,
}: {
    requests: { data: DocumentRequest[]; links: any[] };
    filters: { status?: string };
}) {
    const { auth } = usePage<SharedData>().props;

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
            <Head title="Registrar Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Document Requests</h1>
                        <p className="text-muted-foreground">Manage and track student document requests.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                       <CardTitle>All Requests</CardTitle>
                       <div className="flex items-center gap-2">
                           <Filter className="h-4 w-4 text-muted-foreground" />
                           <Select
                                value={filters.status || 'ALL'}
                                onValueChange={(value) => {
                                    window.location.href = registrar.index.url({ query: { status: value } });
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="PROCESSING">Processing</SelectItem>
                                    <SelectItem value="DEFICIENT">Deficient</SelectItem>
                                    <SelectItem value="READY">Ready</SelectItem>
                                    <SelectItem value="CLAIMED">Claimed</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Reference No.</th>
                                        <th className="px-4 py-3">Student Name</th>
                                        <th className="px-4 py-3">Document</th>
                                        <th className="px-4 py-3">Date Requested</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {requests.data.length > 0 ? (
                                        requests.data.map((req) => (
                                            <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3 font-mono font-medium">{req.reference_number}</td>
                                                <td className="px-4 py-3">{req.student_name}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        {req.document_type}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link href={registrar.show.url(req.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            View
                                                            <ChevronRight className="ml-1 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                         {/* Simple Pagination */}
                         {requests.links && requests.links.length > 3 && (
                            <div className="flex items-center justify-end space-x-2 py-4">
                                {requests.links.map((link, i) => {
                                      // Render basic Previous/Next for simplicity or customize full pagination
                                      // This is a basic implementation to support existing functionality
                                    if (link.url) {
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    }
                                    return <span key={i} className="px-3 py-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: link.label }} />
                                })}
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
