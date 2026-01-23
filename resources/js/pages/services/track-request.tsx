import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import request from '@/routes/request';

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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Track Your Request
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your reference number to check the status of your document.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">
                                Reference Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="reference_number"
                                    name="reference_number"
                                    type="text"
                                    required
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    placeholder="REQ-XXXXXXXXXXXXX"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase"
                                />
                                {errors.reference_number && <p className="text-red-500 text-xs mt-1">{errors.reference_number}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Checking...' : 'Check Status'}
                            </button>
                        </div>
                    </form>
                     <div className="mt-6 text-center">
                        <a
                            href={request.create.url()}
                             className="text-sm font-medium text-gray-500 hover:text-gray-900"
                        >
                            Request a New Document
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
