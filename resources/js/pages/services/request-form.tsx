import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import request from '@/routes/request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Loader2, Upload, FileText, User, Mail, Phone, IdCard, CheckCircle2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Pricing {
    [key: string]: {
        label: string;
    };
}

export default function RequestForm({ pricing, courses }: { pricing: Pricing, courses: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        mobile_number: '',
        student_id_number: '',
        course: '',
        document_types: [] as string[],
        school_id: null as File | null,
    });

    const documents = Object.entries(pricing).map(([id, details]) => ({
        id,
        label: details.label,
    }));

    const toggleDocument = (id: string, checked: boolean) => {
        const current = [...data.document_types];
        if (checked) {
            setData('document_types', [...current, id]);
        } else {
            setData('document_types', current.filter(item => item !== id));
        }
    };

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
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/50 via-background to-primary/50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Request Document" />

            <div className="mx-auto max-w-full">
                <div className="mb-8 text-center text-foreground">
                    <div className="mx-auto mb-4 p-3 rounded-2xl bg-primary/10 text-primary w-fit">
                        <FileText className="h-10 w-10" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                        Document Request Services
                    </h1>
                    <p className="text-md text-muted-foreground">
                        Official document requests made simple and efficient.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Section: Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 text-foreground">
                                        <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle>Student Information</CardTitle>
                                            <CardDescription>Enter your personal and academic details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 text-foreground">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name</Label>
                                            <div className="relative">
                                                <Input
                                                    id="first_name"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    placeholder="Juan"
                                                    className={cn("pl-9", errors.first_name && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {errors.first_name && <p className="text-red-500 text-xs font-medium">{errors.first_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last Name</Label>
                                            <div className="relative">
                                                <Input
                                                    id="last_name"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                    placeholder="Dela Cruz"
                                                    className={cn("pl-9", errors.last_name && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {errors.last_name && <p className="text-red-500 text-xs font-medium">{errors.last_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                                            <Input
                                                id="middle_name"
                                                value={data.middle_name}
                                                onChange={(e) => setData('middle_name', e.target.value)}
                                                placeholder="Santos"
                                                className="bg-transparent"
                                            />
                                        </div>

                                        <Separator className="md:hidden opacity-50" />

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="juan@example.com"
                                                    className={cn("pl-9", errors.email && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mobile_number">Mobile Number</Label>
                                            <div className="relative">
                                                <Input
                                                    id="mobile_number"
                                                    type="tel"
                                                    value={data.mobile_number}
                                                    onChange={(e) => setData('mobile_number', e.target.value)}
                                                    placeholder="09123456789"
                                                    className={cn("pl-9", errors.mobile_number && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {errors.mobile_number && <p className="text-red-500 text-xs font-medium">{errors.mobile_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="student_id_number">Student ID Number</Label>
                                            <div className="relative">
                                                <Input
                                                    id="student_id_number"
                                                    value={data.student_id_number}
                                                    onChange={(e) => setData('student_id_number', e.target.value)}
                                                    placeholder="2023-12345"
                                                    className={cn("pl-9", errors.student_id_number && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {errors.student_id_number && <p className="text-red-500 text-xs font-medium">{errors.student_id_number}</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="course">Course</Label>
                                            <Select value={data.course} onValueChange={(value) => setData('course', value)}>
                                                <SelectTrigger id="course" className={cn("pl-9 relative", (errors as any).course && "border-red-500 focus-visible:ring-red-500")}>
                                                    <div className="absolute left-3 top-2.5">
                                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <SelectValue placeholder="Select Course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {courses.map((courseOption) => (
                                                        <SelectItem key={courseOption} value={courseOption}>
                                                            {courseOption}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {(errors as any).course && <p className="text-red-500 text-xs font-medium">{(errors as any).course}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ID Upload Card */}
                            <Card>
                                <CardHeader className="pb-4">
                                     <div className="flex items-center gap-2 text-foreground">
                                        <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                            <IdCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle>Identity Verification</CardTitle>
                                            <CardDescription>Upload a clear copy of your School ID</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        <Label
                                            htmlFor="file-upload"
                                            className={cn(
                                                "flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-colors bg-muted/20 hover:bg-muted/50",
                                                errors.school_id ? "border-red-300" : "border-muted-foreground/25"
                                            )}
                                        >
                                            {preview ? (
                                                <div className="relative group">
                                                    <img src={preview} alt="ID Preview" className="h-40 w-auto rounded-lg shadow-md object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-medium text-xs">
                                                        Change File
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-2">
                                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                                                    <div className="text-sm font-medium text-primary">Click to upload or drag and drop</div>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 10MB)</p>
                                                </div>
                                            )}
                                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                                        </Label>
                                    </div>
                                    {errors.school_id && <p className="mt-2 text-red-500 text-xs font-medium text-center">{errors.school_id}</p>}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Section: Document Selection */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 text-foreground">
                                        <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                                            <IdCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle>Requirements</CardTitle>
                                            <CardDescription>Select the documents you wish to request.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Badge>
                                        {data.document_types.length} Selected
                                    </Badge>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {documents.map((doc) => {
                                            const isSelected = data.document_types.includes(doc.id);
                                            return (
                                                <div
                                                    key={doc.id}
                                                    className={cn(
                                                        "flex items-center space-x-2 p-2 rounded-lg",
                                                        isSelected
                                                            ? "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80"
                                                            : "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
                                                    )}
                                                >
                                                    <Checkbox
                                                        id={`doc-${doc.id}`}
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => toggleDocument(doc.id, checked === true)}
                                                    />
                                                    <Label htmlFor={`doc-${doc.id}`}>{doc.label}</Label>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {errors.document_types && (
                                        <p className="text-red-300 text-xs font-medium bg-red-950/30 p-2 rounded-md border border-red-500/50">
                                            {errors.document_types}
                                        </p>
                                    )}

                                    <div className="">
                                        <Button
                                            type="submit"
                                            disabled={processing || data.document_types.length === 0}
                                            className="w-full"
                                        >
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Send className="h-5 w-5" />
                                                    <span>Submit Request</span>
                                                </div>
                                            )}
                                        </Button>
                                        <p className="text-xs text-center mt-4">
                                            By submitting, you agree to the processing of your data for document verification purposes.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            ` }} />
        </div>
    );
}
