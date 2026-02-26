import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import request from '@/routes/request';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function TrackRequest() {
    const { data, setData, post, processing, errors } = useForm({
        reference_number: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(request.checkStatus.url());
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/50 via-background to-primary/50 dark:from-zinc-950 dark:to-zinc-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Track Request" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-primary/10 shadow-huge backdrop-blur-sm bg-background/80">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-3 rounded-2xl bg-primary/10 text-primary w-fit">
                            <Search className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Track Your Request</CardTitle>
                        <CardDescription>
                            Enter your reference number to check the status of your document.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="reference_number" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference Number</Label>
                                <Input
                                    id="reference_number"
                                    name="reference_number"
                                    type="text"
                                    required
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    placeholder="R000000"
                                    className="uppercase h-12 text-center text-lg font-mono tracking-widest border-primary/20 focus:border-primary focus:ring-primary/20"
                                />
                                {errors.reference_number && <p className="text-red-500 text-xs text-center mt-2">{errors.reference_number}</p>}
                            </div>

                            <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-5 w-5" />
                                        Track Request
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
