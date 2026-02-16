<?php

namespace Database\Factories;

use App\Models\DocumentRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentRequestFactory extends Factory
{
    protected $model = DocumentRequest::class;

    public function definition()
    {
        return [
            'last_name' => $this->faker->lastName,
            'first_name' => $this->faker->firstName,
            'middle_name' => $this->faker->firstName,
            'email' => $this->faker->email,
            'mobile_number' => $this->faker->phoneNumber,
            'student_id_number' => $this->faker->unique()->numerify('##########'),
            'document_type' => $this->faker->randomElement(['OTR', 'Form 137', 'Diploma', 'Good Moral', 'Cert of Grades']),
            'status' => 'PENDING',
            'school_id_path' => 'school_ids/test.jpg',
        ];
    }
}
