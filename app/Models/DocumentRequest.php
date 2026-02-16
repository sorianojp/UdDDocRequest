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
        'email',
        'mobile_number',
        'student_id_number',
        'document_type', // Keep for backward compatibility/summary
        'status',
        'deficiency_remarks',
        'claiming_date',
        'claimed_date',
        'school_id_path',
    ];

    protected $casts = [
        'claiming_date' => 'datetime',
        'claimed_date' => 'datetime',
    ];

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function items()
    {
        return $this->hasMany(RequestItem::class);
    }

    protected $appends = ['student_name', 'amount_due'];

    public function getStudentNameAttribute()
    {
        return trim("{$this->last_name}, {$this->first_name} {$this->middle_name}");
    }

    public function getAmountDueAttribute()
    {
        return $this->items->sum('price');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->reference_number = strtoupper(uniqid('REQ-'));
        });
    }
}
