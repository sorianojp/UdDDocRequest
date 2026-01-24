<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'last_name',
        'first_name',
        'middle_name',
        'student_id_number',
        'document_type',
        'status',
        'deficiency_remarks',
        'claiming_date',
        'school_id_path',
    ];

    protected $casts = [
        'claiming_date' => 'datetime',
    ];

    protected $appends = ['student_name'];

    public function getStudentNameAttribute()
    {
        return trim("{$this->last_name}, {$this->first_name} {$this->middle_name}");
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->reference_number = strtoupper(uniqid('REQ-'));
        });
    }
}
