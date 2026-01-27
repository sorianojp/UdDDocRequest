import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import request from '@/routes/request';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Head title="Welcome" />

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        University Document Request
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Select an option below to proceed
                    </p>
                </div>

                <Card className="border-0 shadow-lg">
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

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <Link href={request.track.url()} className="block w-full">
                            <Button variant="outline" className="w-full h-16 text-lg" size="lg">
                                <Search className="mr-2 h-6 w-6" />
                                Track Status
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Universidad de Dagupan. All rights reserved.
                </p>
            </div>
        </div>
    );
}
