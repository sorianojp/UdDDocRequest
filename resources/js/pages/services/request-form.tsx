import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import request from '@/routes/request';

export default function RequestForm() {
    const { data, setData, post, processing, errors } = useForm({
        student_name: '',
        student_id_number: '',
        document_type: '',
        school_id: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(request.store.url());
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('school_id', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Request Document" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Request a Document
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Fill in the details below to submit your request.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="student_name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="student_name"
                                    name="student_name"
                                    type="text"
                                    required
                                    value={data.student_name}
                                    onChange={(e) => setData('student_name', e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {errors.student_name && <p className="text-red-500 text-xs mt-1">{errors.student_name}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="student_id_number" className="block text-sm font-medium text-gray-700">
                                Student ID Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="student_id_number"
                                    name="student_id_number"
                                    type="text"
                                    required
                                    value={data.student_id_number}
                                    onChange={(e) => setData('student_id_number', e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {errors.student_id_number && <p className="text-red-500 text-xs mt-1">{errors.student_id_number}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="document_type" className="block text-sm font-medium text-gray-700">
                                Document Type
                            </label>
                            <div className="mt-1">
                                <select
                                    id="document_type"
                                    name="document_type"
                                    required
                                    value={data.document_type}
                                    onChange={(e) => setData('document_type', e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select a document</option>
                                    <option value="OTR">Official Transcript of Records (OTR)</option>
                                    <option value="Form 137">Form 137</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Good Moral">Certificate of Good Moral Character</option>
                                    <option value="Cert of Grades">Certificate of Grades</option>
                                </select>
                                {errors.document_type && <p className="text-red-500 text-xs mt-1">{errors.document_type}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload School ID
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {preview ? (
                                        <img src={preview} alt="ID Preview" className="mx-auto h-32 object-contain" />
                                    ) : (
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="school_id" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            {errors.school_id && <p className="text-red-500 text-xs mt-1">{errors.school_id}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have a request?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href={request.track.url()}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Track Status
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
