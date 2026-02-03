import { Payment } from './payment';
import { RequestItem } from './request-item';

export interface DocumentRequest {
    id: number;
    reference_number: string;
    student_name: string; // Accessor from backend
    last_name: string;
    first_name: string;
    middle_name?: string | null;
    email?: string | null;
    student_id_number: string;
    document_type: string;
    status: 'PENDING'
    | 'WAITING_FOR_PAYMENT'
    | 'VERIFYING_PAYMENT'
    | 'PROCESSING'
    | 'DEFICIENT'
    | 'READY'
    | 'CLAIMED'
    | 'REJECTED';
    deficiency_remarks?: string | null;
    claiming_date?: string | null;
    claimed_date?: string | null;
    created_at: string;
    updated_at: string;
    payment?: Payment;
    items?: RequestItem[];
    amount_due: number;
}
