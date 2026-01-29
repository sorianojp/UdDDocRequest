export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './document-request';
export type * from './payment';
export type * from './request-item';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    sidebarCounts: Record<string, number>;
    [key: string]: unknown;
};
