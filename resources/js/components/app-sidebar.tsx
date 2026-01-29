import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import registrar from '@/routes/registrar';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Folder, LayoutGrid, Clock, Loader2, AlertTriangle, CheckCircle, FileCheck } from 'lucide-react';
import AppLogo from './app-logo';

import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function AppSidebar() {
    const { sidebarCounts } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Requests (All)',
            href: registrar.index.url(),
            icon: FileText,
            badge: sidebarCounts?.all,
        },
        {
            title: 'Pending',
            href: registrar.index.url('pending'),
            icon: Clock,
            badge: sidebarCounts?.pending,
        },
        {
            title: 'Processing',
            href: registrar.index.url('processing'),
            icon: Loader2,
            badge: sidebarCounts?.processing,
        },
        {
            title: 'Deficient',
            href: registrar.index.url('deficient'),
            icon: AlertTriangle,
            badge: sidebarCounts?.deficient,
        },
        {
            title: 'Ready',
            href: registrar.index.url('ready'),
            icon: CheckCircle,
            badge: sidebarCounts?.ready,
        },
        {
            title: 'Claimed',
            href: registrar.index.url('claimed'),
            icon: FileCheck,
            badge: sidebarCounts?.claimed,
        },
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
