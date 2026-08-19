<?php

namespace App\Filament\Resources\Reservations\Tables;

use App\Models\Plan;
use App\Models\Reservation;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ReservationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('ID')->sortable(),
                TextColumn::make('starts_at')->label('Fecha')->date('d/m/Y')->sortable(),
                TextColumn::make('schedule')
                    ->label('Horario')
                    ->state(fn (Reservation $record): string => $record->starts_at->format('H:i').' – '.$record->starts_at->addMinutes($record->duration_minutes)->format('H:i')),
                TextColumn::make('room.name')->label('Sala')->sortable()->searchable(),
                TextColumn::make('client.company_name')->label('Cliente')->placeholder('Externo')->searchable(),
                TextColumn::make('client.company_rut')->label('RUT')->placeholder('Sin registro')->searchable(),
                TextColumn::make('subscription.plan.name')->label('Plan')->placeholder('Sin plan'),
                TextColumn::make('included_minutes_used')->label('Min. incluidos')->numeric(),
                TextColumn::make('total_amount')->label('Total')->money('CLP')->sortable(),
                TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Reservation::STATUS_CONFIRMED => 'success',
                        Reservation::STATUS_COMPLETED => 'info',
                        Reservation::STATUS_CANCELLED => 'danger',
                        Reservation::STATUS_NO_SHOW => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')->label('Creada')->dateTime('d/m/Y H:i')->sortable()->toggleable(),
            ])
            ->filters([
                Filter::make('starts_at')
                    ->label('Fecha')
                    ->schema([
                        DatePicker::make('from')->label('Desde'),
                        DatePicker::make('until')->label('Hasta'),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['from'], fn (Builder $query, string $date): Builder => $query->whereDate('starts_at', '>=', $date))
                        ->when($data['until'], fn (Builder $query, string $date): Builder => $query->whereDate('starts_at', '<=', $date))),
                SelectFilter::make('room_id')->label('Sala')->relationship('room', 'name')->searchable()->preload(),
                SelectFilter::make('status')->label('Estado')->options([
                    Reservation::STATUS_PENDING => 'Pendiente',
                    Reservation::STATUS_CONFIRMED => 'Confirmada',
                    Reservation::STATUS_COMPLETED => 'Completada',
                    Reservation::STATUS_CANCELLED => 'Cancelada',
                    Reservation::STATUS_NO_SHOW => 'No asistió',
                ]),
                SelectFilter::make('plan_id')
                    ->label('Plan')
                    ->options(Plan::query()->orderBy('name')->pluck('name', 'id'))
                    ->query(fn (Builder $query, array $data): Builder => $query->when(
                        $data['value'],
                        fn (Builder $query, int|string $planId): Builder => $query->whereHas(
                            'subscription',
                            fn (Builder $query): Builder => $query->where('plan_id', $planId),
                        ),
                    )),
                SelectFilter::make('customer_type')
                    ->label('Tipo de cliente')
                    ->options(['client' => 'Con plan', 'public' => 'Sin plan'])
                    ->query(fn (Builder $query, array $data): Builder => match ($data['value'] ?? null) {
                        'client' => $query->whereNotNull('subscription_id'),
                        'public' => $query->whereNull('subscription_id'),
                        default => $query,
                    }),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->defaultSort('starts_at', 'desc');
    }
}
