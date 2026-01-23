import { Head, Link } from '@inertiajs/react';
import request from '@/routes/request';
import { home } from '@/routes';

export default function RequestSuccess({ reference_number }: { reference_number: string }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Request Submitted" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg
                            className="h-6 w-6 text-green-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-xl font-medium text-gray-900">Request Submitted Successfully!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Your request has been received. Please keep your reference number safe as you will need it to track the status of your request.
                    </p>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Your Reference Number</p>
                        <p className="mt-1 text-2xl font-bold text-indigo-600 select-all">{reference_number}</p>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={request.track.url()}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Track Request Status
                        </Link>
                    </div>
                    
                     <div className="mt-4">
                        <Link
                            href={home.url()}
                             className="text-sm font-medium text-gray-500 hover:text-gray-900"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
