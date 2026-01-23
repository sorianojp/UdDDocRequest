<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'student_name',
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->reference_number = strtoupper(uniqid('REQ-'));
        });
    }
}
