<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestItem extends Model
{
    protected $fillable = ['document_request_id', 'document_type', 'price'];

    public function documentRequest()
    {
        return $this->belongsTo(DocumentRequest::class);
    }
}
