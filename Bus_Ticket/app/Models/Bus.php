<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    use HasFactory;
    protected $fillable = [
        'bus_number',
        'from',
        'to',
        'total_seats',
        'departure_time',
    ];

    public function ticket()
    {
        return $this->hasOne(Ticket::class);
    }
}
