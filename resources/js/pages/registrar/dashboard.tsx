import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import registrar from '@/routes/registrar';
import { BreadcrumbItem, DocumentRequest, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
    courses = {},
}: {
    requests: { data: DocumentRequest[]; links: any[]; total: number };
    filters: { status?: string; search?: string; course?: string; category?: string };
    courses?: Record<string, string[]>;
}) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [courseCategory, setCourseCategory] = useState<string>(filters.category || 'ALL');
    const [courseFilter, setCourseFilter] = useState(filters.course || 'ALL');

    // Debounce search and course
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '') || courseFilter !== (filters.course || 'ALL') || courseCategory !== (filters.category || 'ALL')) {
                router.get(
                    '/registrar/requests',
                    { 
                        status: filters.status, 
                        search: search, 
                        course: courseFilter === 'ALL' ? '' : courseFilter,
                        category: courseCategory === 'ALL' ? '' : courseCategory
                    },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, courseFilter, courseCategory, filters.status]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
            case 'WAITING_FOR_PAYMENT':
                return <Badge variant="warning">Waiting Payment</Badge>;
            case 'VERIFYING_PAYMENT':
                return <Badge variant="orange">Verify Payment</Badge>;
            case 'PROCESSING':
                return <Badge variant="info">Processing</Badge>;
            case 'DEFICIENT':
                return <Badge variant="destructive">Deficient</Badge>;
            case 'READY':
                return <Badge variant="success">Ready</Badge>;
            case 'CLAIMED':
                return <Badge variant="outline">Claimed</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Rejected</Badge>;
            case 'CANCELLED':
                return <Badge variant="destructive">Cancelled</Badge>;
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
                    <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-4">
                       <CardTitle>
                           {filters.status 
                               ? `${filters.status.charAt(0).toUpperCase() + filters.status.slice(1).toLowerCase()} Requests`
                               : 'All Requests'} {`(${requests.total})`}
                       </CardTitle>
                       <div className="flex flex-col w-full sm:flex-row sm:w-auto items-center gap-2">
                           <div className="w-full sm:w-auto">
                               <Select value={courseFilter} onValueChange={setCourseFilter}>
                                   <SelectTrigger className="w-full sm:w-auto min-w-[250px] max-w-full sm:max-w-[400px] lg:max-w-[600px]">
                                       <SelectValue placeholder={courseCategory === 'ALL' ? "Department/Course" : `${courseCategory} Courses`} />
                                   </SelectTrigger>
                                   <SelectContent className="max-w-[90vw] sm:max-w-none">
                                       <SelectItem value="ALL">All Departments</SelectItem>
                                       {courseCategory === 'ALL' ? (
                                           Object.entries(courses || {}).map(([category, crsList]) => (
                                               <SelectGroup key={category}>
                                                   <SelectLabel>{category}</SelectLabel>
                                                   {crsList.map((c: string) => (
                                                       <SelectItem key={c} value={c}>{c}</SelectItem>
                                                   ))}
                                               </SelectGroup>
                                           ))
                                       ) : (
                                           courses[courseCategory]?.map((c: string) => (
                                               <SelectItem key={c} value={c}>{c}</SelectItem>
                                           ))
                                       )}
                                   </SelectContent>
                               </Select>
                           </div>
                           
                           <RadioGroup 
                               value={courseCategory} 
                               onValueChange={(val) => {
                                   setCourseCategory(val);
                                   setCourseFilter('ALL'); // Reset specific course when changing category
                               }}
                               className="flex items-center space-x-4 border rounded-md px-3 h-9"
                           >
                               <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="ALL" id="cat-all" />
                                   <Label htmlFor="cat-all" className="cursor-pointer">All Categories</Label>
                               </div>
                               <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="Undergraduate" id="cat-ug" />
                                   <Label htmlFor="cat-ug" className="cursor-pointer">Undergrad</Label>
                               </div>
                               <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="Postgraduate" id="cat-pg" />
                                   <Label htmlFor="cat-pg" className="cursor-pointer">Postgrad</Label>
                               </div>
                           </RadioGroup>

                           <Input 
                               type="search" 
                               placeholder="Search name, ID, or ref..." 
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}
                               className="w-full sm:w-[250px]"
                           />
                       </div>
                    </CardHeader>
                    <CardContent>
                        {/* ... (existing table) */}
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50 text-muted-foreground font-medium">
                                    <TableRow>
                                        <TableHead className="px-4 py-3">Reference No.</TableHead>
                                        <TableHead className="px-4 py-3">Student Name</TableHead>
                                        <TableHead className="px-4 py-3">Document</TableHead>
                                        <TableHead className="px-4 py-3">Date Requested</TableHead>
                                        <TableHead className="px-4 py-3">Status</TableHead>
                                        <TableHead className="px-4 py-3 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.data.length > 0 ? (
                                        requests.data.map((req) => (
                                            <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="px-4 py-3 font-mono font-medium">{req.reference_number}</TableCell>
                                                <TableCell className="px-4 py-3">{req.student_name}</TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        {req.document_type}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-muted-foreground">
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="px-4 py-3">{getStatusBadge(req.status)}</TableCell>
                                                <TableCell className="px-4 py-3 text-right">
                                                    <Link href={registrar.show.url(req.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            View
                                                            <ChevronRight className="ml-1 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No requests found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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
