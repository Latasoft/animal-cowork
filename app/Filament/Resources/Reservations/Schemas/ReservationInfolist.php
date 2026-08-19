<?php

namespace App\Filament\Resources\Reservations\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReservationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Reserva')
                    ->schema([
                        TextEntry::make('id')->label('ID'),
                        TextEntry::make('room.name')->label('Sala'),
                        TextEntry::make('starts_at')->label('Inicio')->dateTime('d/m/Y H:i'),
                        TextEntry::make('ends_at')->label('Fin operacional')->dateTime('d/m/Y H:i'),
                        TextEntry::make('duration_minutes')
                            ->label('Duración comercial')
                            ->formatStateUsing(fn (int $state): string => ($state / 60).' h'),
                        TextEntry::make('status')->label('Estado')->badge(),
                    ])->columns(3),
                Section::make('Cliente')
                    ->schema([
                        TextEntry::make('client.company_name')->label('Empresa')->placeholder('Cliente externo'),
                        TextEntry::make('client.company_rut')->label('RUT empresa')->placeholder('Sin registro'),
                        TextEntry::make('contact_name')->label('Contacto'),
                        TextEntry::make('contact_email')->label('Correo'),
                        TextEntry::make('contact_phone')->label('Teléfono'),
                        TextEntry::make('subscription.plan.name')->label('Plan')->placeholder('Sin plan'),
                    ])->columns(3),
                Section::make('Beneficio y pago')
                    ->schema([
                        TextEntry::make('included_minutes_used')->label('Minutos incluidos usados'),
                        TextEntry::make('billable_minutes')->label('Minutos cobrables'),
                        TextEntry::make('rate_per_hour_net')->label('Tarifa neta')->money('CLP'),
                        TextEntry::make('subtotal_net')->label('Subtotal neto')->money('CLP'),
                        TextEntry::make('tax_amount')->label('IVA')->money('CLP'),
                        TextEntry::make('total_amount')->label('Total')->money('CLP'),
                        TextEntry::make('payment_status')->label('Estado pago')->badge(),
                        TextEntry::make('paid_at')->label('Pagado el')->dateTime('d/m/Y H:i')->placeholder('Sin cobro'),
                    ])->columns(4),
                Section::make('Información administrativa')
                    ->schema([
                        TextEntry::make('notes')->label('Notas')->placeholder('Sin notas'),
                        TextEntry::make('cancellation_reason')->label('Motivo de cancelación')->placeholder('No aplica'),
                        TextEntry::make('created_at')->label('Creada el')->dateTime('d/m/Y H:i'),
                    ])->columns(3),
            ]);
    }
}
