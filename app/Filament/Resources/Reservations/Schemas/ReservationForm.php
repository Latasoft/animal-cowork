<?php

namespace App\Filament\Resources\Reservations\Schemas;

use App\Models\Reservation;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReservationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Gestión administrativa')
                    ->description('Los datos económicos, horarios y pagos son históricos y no se editan desde este formulario.')
                    ->schema([
                        Select::make('status')
                            ->label('Estado')
                            ->options([
                                Reservation::STATUS_PENDING => 'Pendiente',
                                Reservation::STATUS_CONFIRMED => 'Confirmada',
                                Reservation::STATUS_COMPLETED => 'Completada',
                                Reservation::STATUS_CANCELLED => 'Cancelada',
                                Reservation::STATUS_NO_SHOW => 'No asistió',
                            ])
                            ->required(),
                        Textarea::make('notes')
                            ->label('Notas')
                            ->rows(4)
                            ->columnSpanFull(),
                        Textarea::make('cancellation_reason')
                            ->label('Motivo de cancelación')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
