export interface DocumentRequest {
    id: number;
    reference_number: string;
    student_name: string;
    student_id_number: string;
    document_type: string;
    status: 'PENDING' | 'PROCESSING' | 'DEFICIENT' | 'READY' | 'CLAIMED';
    deficiency_remarks?: string | null;
    claiming_date?: string | null;
    created_at: string;
    updated_at: string;
}
