import { Payment } from './payment';
import { RequestItem } from './request-item';

export interface DocumentRequest {
    id: number;
    reference_number: string;
    student_name: string; // Accessor from backend
    last_name: string;
    first_name: string;
    middle_name?: string | null;
    student_id_number: string;
    document_type: string;
    status: 'PENDING' | 'PROCESSING' | 'DEFICIENT' | 'READY' | 'CLAIMED';
    deficiency_remarks?: string | null;
    claiming_date?: string | null;
    created_at: string;
    updated_at: string;
    payment?: Payment;
    items?: RequestItem[];
    amount_due: number;
}
