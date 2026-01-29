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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Track Request" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Track Your Request</CardTitle>
                        <CardDescription className="text-center">
                            Enter your reference number to check the status of your document.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="reference_number">Reference Number</Label>
                                <Input
                                    id="reference_number"
                                    name="reference_number"
                                    type="text"
                                    required
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    placeholder="REQ-XXXXXXXXXXXXX"
                                    className="uppercase"
                                />
                                {errors.reference_number && <p className="text-red-500 text-xs">{errors.reference_number}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
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
