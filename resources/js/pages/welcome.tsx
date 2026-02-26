import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import request from '@/routes/request';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <Head title="Welcome" />

            <div className="w-full max-w-xl space-y-8">
                <div className="text-center">
                    <img src="/images/logo.png" alt="UdD Logo" className="mx-auto h-32 w-auto mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight">
                        Universidad de Dagupan Document Request
                    </h1>
                    <p className="mt-2">
                        Select an option below to proceed
                    </p>
                </div>

                <Card>
                    <CardHeader className="sr-only">
                        <CardTitle>Menu</CardTitle>
                        <CardDescription>Main Navigation</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <Link href={request.create.url()} className="block w-full">
                            <Button className="w-full h-16 text-lg" size="lg">
                                <FileText className="mr-2 h-6 w-6" />
                                Request a Document
                            </Button>
                        </Link>

                        <Link href={request.track.url()} className="block w-full">
                            <Button variant="secondary" className="w-full h-16 text-lg" size="lg">
                                <Search className="mr-2 h-6 w-6" />
                                Track Status
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <p className="text-center text-sm">
                    &copy; {new Date().getFullYear()} Universidad de Dagupan. All rights reserved.
                </p>
            </div>
        </div>
    );
}
