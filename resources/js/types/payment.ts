export interface Payment {
    id: number;
    document_request_id: number;
    reference_number: string;
    amount: number;
    payment_method: string;
    status: 'pending' | 'verified' | 'rejected';
    proof_file_path?: string;
    paid_at?: string;
    created_at: string;
    updated_at: string;
}
