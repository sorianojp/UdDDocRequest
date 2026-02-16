import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, Loader2, AlertTriangle, CheckCircle, FileCheck, XCircle } from 'lucide-react';

export default function Dashboard({ counts }: { counts: Record<string, number> }) {
    const stats = [
        {
            label: 'Pending',
            value: counts.PENDING || 0,
            icon: Clock,
            color: 'text-orange-500 dark:text-orange-400',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
        },
        {
            label: 'Processing',
            value: counts.PROCESSING || 0,
            icon: Loader2,
            color: 'text-blue-500 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: 'Deficient',
            value: counts.DEFICIENT || 0,
            icon: AlertTriangle,
            color: 'text-red-500 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20',
        },
        {
            label: 'Ready',
            value: counts.READY || 0,
            icon: CheckCircle,
            color: 'text-green-500 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            label: 'Claimed',
            value: counts.CLAIMED || 0,
            icon: FileCheck,
            color: 'text-gray-500 dark:text-gray-400',
            bg: 'bg-gray-50 dark:bg-gray-800/50',
        },
        {
            label: 'Rejected',
            value: counts.REJECTED || 0,
            icon: XCircle,
            color: 'text-red-900 dark:text-red-300',
            bg: 'bg-red-100 dark:bg-red-900/30',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-6">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">Requests</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="max-w-full">
                     <Card className="border-blue-200 bg-blue-50/50 shadow-md dark:bg-blue-900/10 dark:border-blue-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl text-blue-900 flex items-center gap-2 dark:text-blue-100">
                                <FileCheck className="h-6 w-6" />
                                Quick Claim
                            </CardTitle>
                            <CardDescription className="text-base">
                                Scan or enter reference number (e.g., R123456) to instantly mark a request as claimed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const formData = new FormData(form);
                                const ref = formData.get('reference_number');
                                if (ref) {
                                    router.post('/registrar/quick-claim', { reference_number: ref }, {
                                        preserveScroll: true,
                                        onSuccess: () => form.reset(),
                                    });
                                }
                            }} className="flex gap-4">
                                <Input 
                                    name="reference_number" 
                                    placeholder="R000000" 
                                    className="bg-white dark:bg-background text-4xl md:text-4xl font-mono tracking-widest h-20 text-center uppercase"
                                    required
                                    autoFocus
                                    maxLength={7}
                                />
                                <Button type="submit" size="lg" className="h-20 px-8 text-xl" title="Mark as Claimed">
                                    <CheckCircle className="h-8 w-8 mr-2" />
                                    Claim
                                </Button>
                            </form>

                            {/* Flash Messages */}
                            {usePage<SharedData>().props.flash?.success && (
                                <Alert className="mt-4 border-green-200 bg-green-50 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100">
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>
                                        {usePage<SharedData>().props.flash.success}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {usePage<SharedData>().props.flash?.error && (
                                <Alert variant="destructive" className="mt-4">
                                    <XCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {usePage<SharedData>().props.flash.error}
                                    </AlertDescription>
                                </Alert>
                            )}
                             {usePage<SharedData>().props.errors?.reference_number && (
                                <Alert variant="destructive" className="mt-4">
                                    <XCircle className="h-4 w-4" />
                                    <AlertTitle>Validation Error</AlertTitle>
                                    <AlertDescription>
                                        {usePage<SharedData>().props.errors.reference_number}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
