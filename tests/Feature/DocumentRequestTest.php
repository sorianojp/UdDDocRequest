<?php

namespace Tests\Feature;

use App\Models\DocumentRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_submit_request()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('id.jpg');

        $response = $this->post(route('request.store'), [
            'last_name' => 'Doe',
            'first_name' => 'John',
            'middle_name' => 'D',
            'email' => 'john@example.com',
            'student_id_number' => '12345678',
            'document_types' => ['OTR'],
            'mobile_number' => '09123456789',
            'school_id' => $file,
        ]);

        $request = DocumentRequest::first();

        $this->assertNotNull($request);
        $this->assertEquals('Doe, John D', $request->student_name);
        $this->assertEquals('09123456789', $request->mobile_number);
        $this->assertEquals('PENDING', $request->status);
        Storage::disk('public')->assertExists($request->school_id_path);

        $response->assertRedirect(route('request.show-status', ['reference_number' => $request->reference_number])); // Pass param explicitly if needed, or route helper might handle it if defined with parameter
    }

    public function test_student_can_track_request()
    {
        $request = DocumentRequest::create([
            'reference_number' => 'REQ-TEST',
            'last_name' => 'Doe',
            'first_name' => 'Jane',
            'email' => 'jane@example.com',
            'student_id_number' => '87654321',
            'document_type' => 'Diploma',
            'school_id_path' => 'path/to/id.jpg',
        ]);

        $response = $this->post(route('request.check-status'), [
            'reference_number' => $request->reference_number,
        ]);

        $response->assertInertia(fn ($page) => $page
            ->component('services/track-result')
            ->where('request.last_name', 'Doe')
        );
    }

    public function test_registrar_can_view_requests()
    {
        $user = User::factory()->create();

        $request = DocumentRequest::create([
            'last_name' => 'Student',
            'first_name' => 'Test',
            'email' => 'test@example.com',
            'student_id_number' => '00000',
            'document_type' => 'Form 137',
            'school_id_path' => 'path.jpg',
        ]);

        $response = $this->actingAs($user)->get(route('registrar.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('registrar/dashboard')
            ->has('requests.data', 1)
        );
    }

    public function test_registrar_can_update_status()
    {
        $user = User::factory()->create();

        $request = DocumentRequest::create([
            'last_name' => 'Student',
            'first_name' => 'Test',
            'email' => 'test@example.com',
            'student_id_number' => '00000',
            'document_type' => 'Form 137',
            'status' => 'PENDING',
            'school_id_path' => 'path.jpg',
        ]);

        $response = $this->actingAs($user)->put(route('registrar.update', $request->id), [
            'status' => 'PROCESSING',
        ]);

        $request->refresh();
        $this->assertEquals('PROCESSING', $request->status);
    }
    
    public function test_registrar_cannot_update_invalid_status()
    {
        $user = User::factory()->create();

        $request = DocumentRequest::create([
            'last_name' => 'Student',
            'first_name' => 'Test',
            'email' => 'test@example.com',
            'student_id_number' => '00000',
            'document_type' => 'Form 137',
            'status' => 'PENDING',
            'school_id_path' => 'path.jpg',
        ]);

        $response = $this->actingAs($user)->put(route('registrar.update', $request->id), [
            'status' => 'INVALID_STATUS',
        ]);

        $response->assertSessionHasErrors('status');
    }
}
