import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save, Settings2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
import { FormEventHandler } from 'react';

export default function SettingsIndex({ settings }: { settings: Record<string, string | number> }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Settings',
            href: admin.settings.index.url(),
        },
    ];

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        daily_request_limit: settings.daily_request_limit || 3,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        put(admin.settings.update.url(), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Settings" />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
                    <p className="text-muted-foreground">Manage global application configurations and limits.</p>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                <Settings2 className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Request Limits</CardTitle>
                                <CardDescription>Configure how many requests students can submit.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-w-sm">
                                <Label htmlFor="daily_request_limit">Global Daily Request Limit</Label>
                                <Input
                                    id="daily_request_limit"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={data.daily_request_limit}
                                    onChange={(e) => setData('daily_request_limit', parseInt(e.target.value))}
                                    disabled={processing}
                                />
                                <p className="text-xs text-muted-foreground">
                                    The maximum total number of document requests that can be submitted collectively by all students within a 24-hour day.
                                </p>
                                {errors.daily_request_limit && (
                                    <p className="text-sm text-destructive mt-1">{errors.daily_request_limit}</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 flex justify-end px-6 py-4">
                            <div className="flex items-center gap-4">
                                {recentlySuccessful && (
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Saved!</p>
                                )}
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
