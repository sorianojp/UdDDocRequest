import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import request from '@/routes/request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RequestForm() {
    const { data, setData, post, processing, errors } = useForm({
        last_name: '',
        first_name: '',
        middle_name: '',
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Request a Document</CardTitle>
                        <CardDescription className="text-center">
                            Fill in the details below to submit your request.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        required
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="Dela Cruz"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        required
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="Juan"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                                <Input
                                    id="middle_name"
                                    name="middle_name"
                                    type="text"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    placeholder="Santos"
                                />
                                {errors.middle_name && <p className="text-red-500 text-xs">{errors.middle_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="student_id_number">Student ID Number</Label>
                                <Input
                                    id="student_id_number"
                                    name="student_id_number"
                                    type="text"
                                    required
                                    value={data.student_id_number}
                                    onChange={(e) => setData('student_id_number', e.target.value)}
                                />
                                {errors.student_id_number && <p className="text-red-500 text-xs">{errors.student_id_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="document_type">Document Type</Label>
                                <Select
                                    value={data.document_type}
                                    onValueChange={(value) => setData('document_type', value)}
                                >
                                    <SelectTrigger id="document_type">
                                        <SelectValue placeholder="Select a document" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OTR">Official Transcript of Records (OTR)</SelectItem>
                                        <SelectItem value="Form 137">Form 137</SelectItem>
                                        <SelectItem value="Diploma">Diploma</SelectItem>
                                        <SelectItem value="Good Moral">Certificate of Good Moral Character</SelectItem>
                                        <SelectItem value="Cert of Grades">Certificate of Grades</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.document_type && <p className="text-red-500 text-xs">{errors.document_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Upload School ID</Label>
                                <label htmlFor="file-upload" className="mt-1 flex flex-col items-center justify-center pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        {preview ? (
                                            <img src={preview} alt="ID Preview" className="mx-auto h-32 object-contain mb-4" />
                                        ) : (
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                                            <div
                                                className="relative rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="school_id" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </label>
                                {errors.school_id && <p className="text-red-500 text-xs">{errors.school_id}</p>}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center flex-col space-y-4">
                        <div className="w-full border-t border-gray-200" />
                        <div className="w-full">
                            <a href={request.track.url()}>
                                <Button variant="secondary" className="w-full">
                                    Track Status
                                </Button>
                            </a>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
