import { Head, Link } from '@inertiajs/react';
import requestRoutes from '@/routes/request';
import { home } from '@/routes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function RequestSuccess({ request }: { request: { id: number, reference_number: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Request Submitted" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle>Request Submitted Successfully!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <p className="text-sm text-gray-500">
                            Your request has been received. Please keep your reference number safe as you will need it to track the status of your request.
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Your Reference Number</p>
                            <p className="mt-1 text-2xl font-bold text-indigo-600 select-all font-mono">{request.reference_number}</p>
                        </div>


                    </CardContent>
                     <CardFooter className="flex flex-col space-y-4">
                         <a href={requestRoutes.track.url()} className="w-full">
                            <Button className="w-full">Track Request Status</Button>
                        </a>
                        <Link href={home.url()} className="text-sm text-gray-500 hover:text-gray-900">
                                Back to Home
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
