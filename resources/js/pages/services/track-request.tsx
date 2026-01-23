import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import request from '@/routes/request';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
                        <CardTitle className="text-center text-xl">Track Your Request</CardTitle>
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

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Checking...' : 'Check Status'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center flex-col space-y-4">
                        <div className="w-full border-t border-gray-200" />
                        <div className="w-full text-center">
                            <a href={request.create.url()} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                Request a New Document
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
