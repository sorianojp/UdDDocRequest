import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Loader2, AlertTriangle, CheckCircle, FileCheck, XCircle } from 'lucide-react';

export default function Dashboard({ counts }: { counts: Record<string, number> }) {
    const stats = [
        {
            label: 'Pending',
            value: counts.PENDING || 0,
            icon: Clock,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        },
        {
            label: 'Processing',
            value: counts.PROCESSING || 0,
            icon: Loader2,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            label: 'Deficient',
            value: counts.DEFICIENT || 0,
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-50',
        },
        {
            label: 'Ready',
            value: counts.READY || 0,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50',
        },
        {
            label: 'Claimed',
            value: counts.CLAIMED || 0,
            icon: FileCheck,
            color: 'text-gray-500',
            bg: 'bg-gray-50',
        },
        {
            label: 'Rejected',
            value: counts.REJECTED || 0,
            icon: XCircle,
            color: 'text-red-900',
            bg: 'bg-red-100',
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
                                <CardTitle>
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
                
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
