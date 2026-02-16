<?php

namespace Tests\Feature;

use App\Models\DocumentRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_submit_payment_proof()
    {
        Storage::fake('public');

        $request = DocumentRequest::factory()->create([
            'status' => 'WAITING_FOR_PAYMENT',
        ]);

        $request->items()->create([
            'document_type' => 'Diploma',
            'price' => 100.00,
        ]);

        $file = UploadedFile::fake()->image('proof.jpg');

        $response = $this->post(route('request.payment.store', $request->id), [
            'reference_number' => 'REF123456',
            'proof' => $file,
        ]);

        $response->assertRedirect(route('request.show-status', ['reference_number' => $request->reference_number]));
        
        $this->assertDatabaseHas('payments', [
            'document_request_id' => $request->id,
            'reference_number' => 'REF123456',
            'amount' => 100.00,
            'status' => 'pending',
        ]);

        $request->refresh();
        $this->assertEquals('VERIFYING_PAYMENT', $request->status);
    }
}
