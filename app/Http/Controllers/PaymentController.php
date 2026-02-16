<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentProofSubmitted;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function show(DocumentRequest $request)
    {
        return Inertia::render('services/payment', [
            'request' => $request->load('payment'),
            'amount' => $request->amount_due,
        ]);
    }

    public function store(Request $httpRequest, DocumentRequest $request)
    {
        $httpRequest->validate([
            'proof' => ['required', 'image', 'max:10240'], // 10MB
            'reference_number' => ['required', 'string', 'max:255'],
        ]);

        $path = $httpRequest->file('proof')->store('payments', 'public');

        $payment = Payment::updateOrCreate(
            ['document_request_id' => $request->id],
            [
                'reference_number' => $httpRequest->reference_number,
                'external_reference_number' => $httpRequest->reference_number, // User input ref number
                'amount' => $request->amount_due,
                'proof_file_path' => $path,
                'status' => 'pending',
                'paid_at' => null, // Reset if previously paid/verified (though uncommon for rejection flow)
            ]
        );

        // Update request status to VERIFYING_PAYMENT
        $request->update(['status' => 'VERIFYING_PAYMENT']);

        // Send email notification
        if ($request->email) {
            Mail::to($request->email)->send(new PaymentProofSubmitted($request));
        }

        return redirect()->route('request.show-status', ['reference_number' => $request->reference_number])
            ->with('success', 'Payment proof uploaded successfully. Please wait for verification.');
    }

    public function update(Request $httpRequest, Payment $payment)
    {
        $httpRequest->validate([
            'status' => 'required|in:verified,rejected,pending',
        ]);

        $payment->update([
            'status' => $httpRequest->status,
            'paid_at' => $httpRequest->status === 'verified' ? now() : null,
        ]);

        if ($httpRequest->status === 'verified') {
            $payment->documentRequest->update(['status' => 'PROCESSING']);
        } elseif ($httpRequest->status === 'rejected') {
            $payment->documentRequest->update(['status' => 'WAITING_FOR_PAYMENT']);
        }

        return back()->with('success', 'Payment status updated.');
    }
}
