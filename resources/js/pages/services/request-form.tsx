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
import { Send, Loader2, Upload, FileText, User, Mail, Phone, IdCard, CheckCircle2, GraduationCap, MapPin, Calendar, Building, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
interface Pricing {
    [key: string]: {
        label: string;
    };
}

export default function RequestForm({ pricing, courses, dailyLimit = 1000, todayRequestsCount = 0 }: { pricing: Pricing, courses: Record<string, string[]>, dailyLimit?: number, todayRequestsCount?: number }) {
    const { data, setData, post, processing, errors } = useForm({
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        mobile_number: '',
        student_id_number: '',
        course: '',
        address: '',
        birthdate: '',
        birthplace: '',
        higschool: '',
        hs_grad_year: '',
        prev_school: '',
        document_types: [] as string[],
        purposes: {} as Record<string, string>,
        student_type: 'Freshman' as 'Freshman' | 'Transferee' | 'Postgraduate',
        otr_copy: null as File | null,
        form_137: null as File | null,
    });

    const documents = Object.entries(pricing).map(([id, details]) => ({
        id,
        label: details.label,
    }));

    const toggleDocument = (id: string, checked: boolean) => {
        const currentTypes = [...data.document_types];
        if (checked) {
            setData('document_types', [...currentTypes, id]);
        } else {
            const nextPurposes = { ...data.purposes };
            delete nextPurposes[id];
            
            setData(prev => ({
                ...prev,
                document_types: currentTypes.filter(item => item !== id),
                purposes: nextPurposes
            }));
        }
    };

    const handlePurposeChange = (id: string, value: string) => {
        setData(prev => ({
            ...prev,
            purposes: {
                ...prev.purposes,
                [id]: value
            }
        }));
    };

    const [courseCategory, setCourseCategory] = useState<string>('Undergraduate');

    const isUdDAlumni = data.prev_school.toLowerCase().includes('universidad de dagupan') || 
                        data.prev_school.toLowerCase().includes('udd') ||
                        data.prev_school.toLowerCase().includes('colegio de dagupan') ||
                        data.prev_school.toLowerCase().includes('cdd');
    
    // Transferee or Postgrad (but not from UdD) Needs OTR
    const needsOTR = (data.student_type === 'Transferee' || data.student_type === 'Postgraduate') && !isUdDAlumni;
    
    // Freshman Needs Form 137
    const needsForm137 = data.student_type === 'Freshman';

    const isSubmitDisabled = processing 
        || data.document_types.length === 0 
        || data.document_types.some(id => !data.purposes[id] || data.purposes[id].trim() === '')
        || (needsOTR && !data.otr_copy)
        || (needsForm137 && !data.form_137)
        || (data.student_type !== 'Freshman' && !data.prev_school);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(request.store.url(), {
            forceFormData: true,
        });
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
                
                {errors.document_types && (
                    <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <Badge variant="destructive" className="px-4 py-2 text-sm gap-2 border-2 shadow-lg">
                            <AlertTriangle className="h-4 w-4" />
                            {errors.document_types}
                        </Badge>
                    </div>
                )}
                {/* Use optional chaining and array bracket notation to bypass strict typescript checking for custom/general errors from backend */}
                {errors['submit_limit' as keyof typeof errors] && (
                    <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <Badge variant="destructive" className="px-4 py-2 text-sm gap-2 border-2 shadow-lg bg-red-600 text-white">
                            <AlertTriangle className="h-4 w-4" />
                            {errors['submit_limit' as keyof typeof errors]}
                        </Badge>
                    </div>
                )}

                {todayRequestsCount >= dailyLimit ? (
                    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in zoom-in-95 duration-500">
                        <Card className="border-destructive/30 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive" />
                            <CardContent className="flex flex-col items-center text-center p-10 pt-12">
                                <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
                                <h2 className="text-3xl font-extrabold mb-4">Daily Limit Reached</h2>
                                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                                    We have reached our maximum capacity of {dailyLimit} document requests for today. Please return tomorrow to submit your request.
                                </p>
                                <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
                                    Refresh Page
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
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
                                                    placeholder="26-1234-567"
                                                    className={cn("pl-9", errors.student_id_number && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {errors.student_id_number && <p className="text-red-500 text-xs font-medium">{errors.student_id_number}</p>}
                                        </div>

                                        <Separator className="md:col-span-2 opacity-50" />

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Address</Label>
                                            <div className="relative">
                                                <Input
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    placeholder="123 Main St, City"
                                                    className={cn("pl-9", (errors as any).address && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {(errors as any).address && <p className="text-red-500 text-xs font-medium">{(errors as any).address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="birthdate">Birthdate</Label>
                                            <div className="relative">
                                                <Input
                                                    id="birthdate"
                                                    type="date"
                                                    value={data.birthdate}
                                                    onChange={(e) => setData('birthdate', e.target.value)}
                                                    className={cn("pl-9", (errors as any).birthdate && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {(errors as any).birthdate && <p className="text-red-500 text-xs font-medium">{(errors as any).birthdate}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="birthplace">Birthplace</Label>
                                            <div className="relative">
                                                <Input
                                                    id="birthplace"
                                                    value={data.birthplace}
                                                    onChange={(e) => setData('birthplace', e.target.value)}
                                                    placeholder="City, Province"
                                                    className={cn("pl-9", (errors as any).birthplace && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {(errors as any).birthplace && <p className="text-red-500 text-xs font-medium">{(errors as any).birthplace}</p>}
                                        </div>

                                        <Separator className="md:col-span-2 opacity-50" />

                                        <div className="space-y-2">
                                            <Label htmlFor="higschool">High School</Label>
                                            <div className="relative">
                                                <Input
                                                    id="higschool"
                                                    value={data.higschool}
                                                    onChange={(e) => setData('higschool', e.target.value)}
                                                    placeholder="High School Name"
                                                    className={cn("pl-9", (errors as any).higschool && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {(errors as any).higschool && <p className="text-red-500 text-xs font-medium">{(errors as any).higschool}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="hs_grad_year">HS Graduation Year</Label>
                                            <div className="relative">
                                                <Input
                                                    id="hs_grad_year"
                                                    value={data.hs_grad_year}
                                                    onChange={(e) => setData('hs_grad_year', e.target.value)}
                                                    placeholder="2020"
                                                    className={cn("pl-9", (errors as any).hs_grad_year && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {(errors as any).hs_grad_year && <p className="text-red-500 text-xs font-medium">{(errors as any).hs_grad_year}</p>}
                                        </div>

                                        <Separator className="md:col-span-2 opacity-50" />

                                        <div className="space-y-4 md:col-span-2">
                                            <div className="space-y-3">
                                                <Label className="text-blue-600 dark:text-blue-400 font-semibold text-lg">Course Level & Admission Type</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-accent/30 border border-accent/50">
                                                    <div className="space-y-3">
                                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">1. Select Course Level</Label>
                                                        <RadioGroup 
                                                            value={courseCategory} 
                                                            onValueChange={(val) => {
                                                                setCourseCategory(val);
                                                                setData((oldData) => ({
                                                                    ...oldData,
                                                                    course: '',
                                                                    student_type: val === 'Postgraduate' ? 'Postgraduate' : 'Freshman'
                                                                }));
                                                            }}
                                                            className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Undergraduate" id="r1" />
                                                                <Label htmlFor="r1" className="font-normal cursor-pointer">Undergraduate</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Postgraduate" id="r2" />
                                                                <Label htmlFor="r2" className="font-normal cursor-pointer">Postgraduate</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>

                                                    {courseCategory === 'Undergraduate' && (
                                                        <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">2. Did you enter UdD as a Freshman or Transferee?</Label>
                                                            <RadioGroup 
                                                                value={data.student_type} 
                                                                onValueChange={(val: any) => setData('student_type', val)}
                                                                className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="Freshman" id="st1" />
                                                                    <Label htmlFor="st1" className="font-normal cursor-pointer">Freshman (from HS)</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="Transferee" id="st2" />
                                                                    <Label htmlFor="st2" className="font-normal cursor-pointer">Transferee</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {data.student_type !== 'Freshman' && (
                                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <Label htmlFor="prev_school" className="flex items-center gap-1.5">
                                                        Previous School <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="prev_school"
                                                            value={data.prev_school}
                                                            onChange={(e) => setData('prev_school', e.target.value)}
                                                            placeholder="University/College Name"
                                                            className={cn("pl-9", (errors as any).prev_school && "border-red-500 focus-visible:ring-red-500")}
                                                            required
                                                        />
                                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground italic">Required for Transferee and Postgraduate students.</p>
                                                    {(errors as any).prev_school && <p className="text-red-500 text-xs font-medium">{(errors as any).prev_school}</p>}
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="course">Course <span className="text-red-500">*</span></Label>
                                                <Select value={data.course} onValueChange={(value) => setData('course', value)}>
                                                    <SelectTrigger id="course" className={cn("pl-9 relative", (errors as any).course && "border-red-500 focus-visible:ring-red-500")}>
                                                        <div className="absolute left-3 top-2.5">
                                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <SelectValue placeholder={`Select ${courseCategory} Course`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {courses[courseCategory]?.map((courseOption) => (
                                                            <SelectItem key={courseOption} value={courseOption}>
                                                                {courseOption}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {(errors as any).course && <p className="text-red-500 text-xs font-medium">{(errors as any).course}</p>}
                                            </div>

                                            {needsOTR && (
                                                <div className="space-y-2 mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <Label htmlFor="otr_copy" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                                                        <FileText className="h-4 w-4" /> Receiving Copy of OTR <span className="text-red-500">*</span>
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground pb-1">
                                                        As a Transferee or Postgraduate student, please upload your "Copy for Universidad de Dagupan" OTR.
                                                    </p>
                                                    <Input
                                                        id="otr_copy"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                                                        onChange={(e) => setData('otr_copy', e.target.files ? e.target.files[0] : null)}
                                                        className={cn("cursor-pointer", (errors as any).otr_copy && "border-red-500 focus-visible:ring-red-500")}
                                                    />
                                                    {(errors as any).otr_copy && <p className="text-red-500 text-xs font-medium">{(errors as any).otr_copy}</p>}
                                                </div>
                                            )}

                                            {needsForm137 && (
                                                <div className="space-y-2 mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    <Label htmlFor="form_137" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                                                        <FileText className="h-4 w-4" /> Form 137 <span className="text-red-500">*</span>
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground pb-1">
                                                        As a Freshman student coming from High School, please upload your Form 137.
                                                    </p>
                                                    <Input
                                                        id="form_137"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                                                        onChange={(e) => setData('form_137', e.target.files ? e.target.files[0] : null)}
                                                        className={cn("cursor-pointer", (errors as any).form_137 && "border-red-500 focus-visible:ring-red-500")}
                                                    />
                                                    {(errors as any).form_137 && <p className="text-red-500 text-xs font-medium">{(errors as any).form_137}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
                                            <CardTitle>Documents</CardTitle>
                                            <CardDescription>Select the documents you wish to request.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Badge>
                                        {data.document_types.length} Selected
                                    </Badge>
                                    <div className="space-y-4 pr-2">
                                        {documents.map((doc) => {
                                            const isSelected = data.document_types.includes(doc.id);
                                            const purposeError = (errors as any)[`purposes.${doc.id}`];
                                            
                                            return (
                                                <div key={doc.id} className="space-y-2">
                                                    <div
                                                        className={cn(
                                                            "flex items-center space-x-2 p-3 rounded-lg transition-colors",
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
                                                        <Label htmlFor={`doc-${doc.id}`} className="cursor-pointer flex-1 font-medium select-none text-base">
                                                            {doc.label}
                                                        </Label>
                                                    </div>
                                                    
                                                    {isSelected && (
                                                        <div className="pl-8 pr-2 animate-in slide-in-from-top-2 fade-in duration-200">
                                                            <div className="space-y-1.5">
                                                                <Label htmlFor={`purpose-${doc.id}`} className="text-xs text-muted-foreground ml-1">
                                                                    Purpose of Request <span className="text-red-500">*</span>
                                                                </Label>
                                                                {(doc.id.includes('Certificate') || doc.id === 'Transcript of Records' || doc.id === 'Diploma') ? (
                                                                    <Select 
                                                                        value={data.purposes[doc.id] || ''} 
                                                                        onValueChange={(value) => handlePurposeChange(doc.id, value)}
                                                                    >
                                                                        <SelectTrigger 
                                                                            id={`purpose-${doc.id}`} 
                                                                            className={cn("w-full bg-transparent", purposeError && "border-red-500 focus-visible:ring-red-500")}
                                                                        >
                                                                            <SelectValue placeholder="Select purpose" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Ranking">Ranking</SelectItem>
                                                                            <SelectItem value="Promotion">Promotion</SelectItem>
                                                                            <SelectItem value="Evaluation">Evaluation</SelectItem>
                                                                            <SelectItem value="Verification">Verification</SelectItem>
                                                                            <SelectItem value="Employment">Employment</SelectItem>
                                                                            <SelectItem value="For Abroad">For Abroad</SelectItem>
                                                                            <SelectItem value="Board Examination">Board Examination</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                ) : (
                                                                    <textarea
                                                                        id={`purpose-${doc.id}`}
                                                                        value={data.purposes[doc.id] || ''}
                                                                        onChange={(e) => handlePurposeChange(doc.id, e.target.value)}
                                                                        placeholder="e.g. Board Examination, Employment, Abroad, Verification, Evaluation..."
                                                                        className={cn(
                                                                            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                                                                            purposeError && "border-red-500 focus-visible:ring-red-500",
                                                                            "resize-none overflow-auto"
                                                                        )}
                                                                    />
                                                                )}
                                                                {purposeError && <p className="text-red-500 text-xs font-medium ml-1">{purposeError}</p>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitDisabled}
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
                )}
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
