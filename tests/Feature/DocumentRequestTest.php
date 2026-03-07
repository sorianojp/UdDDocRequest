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
    use \Illuminate\Foundation\Testing\WithoutMiddleware;

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
            'purposes' => ['OTR' => 'Employment'],
            'mobile_number' => '09123456789',
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'student_type' => 'Freshman',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Sample Prev',
            'form_137' => UploadedFile::fake()->image('form137.jpg'),
        ]);

        $request = DocumentRequest::first();

        $this->assertNotNull($request);
        $this->assertEquals('Doe, John D', $request->student_name);
        $this->assertEquals('09123456789', $request->mobile_number);
        $this->assertEquals('PENDING', $request->status);

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
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Sample Prev',
            'mobile_number' => '09000000000',
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
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Sample Prev',
            'mobile_number' => '09000000000',
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
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Sample Prev',
            'mobile_number' => '09000000000',
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
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Sample Prev',
            'mobile_number' => '09000000000',
        ]);

        $response = $this->actingAs($user)->put(route('registrar.update', $request->id), [
            'status' => 'INVALID_STATUS',
        ]);

        $response->assertSessionHasErrors('status');
    }

    public function test_student_can_upload_otr_and_form_137()
    {
        Storage::fake('public');

        $otrFile = UploadedFile::fake()->create('otr_copy.pdf', 100);
        $form137File = UploadedFile::fake()->create('form_137.jpg', 100);

        $response = $this->post(route('request.store'), [
            'last_name' => 'Doe',
            'first_name' => 'John',
            'middle_name' => 'D',
            'email' => 'john@example.com',
            'student_id_number' => '12345678',
            'document_types' => ['OTR'],
            'purposes' => ['OTR' => 'Employment'],
            'mobile_number' => '09123456789',
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'student_type' => 'Transferee',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Sample Prev',
            'otr_copy' => $otrFile,
            'form_137' => $form137File,
        ]);

        $response->assertStatus(302);

        $request = DocumentRequest::where('student_id_number', '12345678')->first();
        $this->assertNotNull($request, "Request was not created");

        $this->assertNotNull($request->otr_copy_path);
        $this->assertNotNull($request->form_137_path);

        Storage::disk('public')->assertExists($request->otr_copy_path);
        Storage::disk('public')->assertExists($request->form_137_path);
    }

    public function test_colegio_de_dagupan_alumni_not_required_otr()
    {
        Storage::fake('public');

        $response = $this->post(route('request.store'), [
            'last_name' => 'Alumni',
            'first_name' => 'Test',
            'middle_name' => 'D',
            'email' => 'alumni@example.com',
            'student_id_number' => '11112222',
            'document_types' => ['OTR'],
            'purposes' => ['OTR' => 'Board Exam'],
            'mobile_number' => '09123456789',
            'address' => 'Sample Address',
            'birthdate' => '2000-01-01',
            'birthplace' => 'Manila',
            'course' => 'BSCS',
            'student_type' => 'Transferee',
            'higschool' => 'Sample HS',
            'hs_grad_year' => '2018',
            'prev_school' => 'Colegio de Dagupan', 
        ]);

        $response->assertStatus(302);
        $request = DocumentRequest::where('student_id_number', '11112222')->first();
        $this->assertNotNull($request);
        $this->assertNull($request->otr_copy_path);
    }
}
