<?php

namespace App\Filament\Resources\Clients\Pages;

use App\Filament\Resources\Clients\ClientResource;
use App\Filament\Resources\Clients\Widgets\ClientPlanDistributionChart;
use App\Filament\Resources\Clients\Widgets\ClientStatsOverview;
use App\Models\Plan;
use App\Services\Payments\TransferPurchaseService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Support\Icons\Heroicon;

class ListClients extends ListRecords
{
    protected static string $resource = ClientResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->transferAction(),
            CreateAction::make(),
        ];
    }

    /**
     * Contratación pagada por transferencia: registra el pago y entrega
     * un enlace para completar los datos y generar el contrato.
     */
    private function transferAction(): Action
    {
        return Action::make('transferPurchase')
            ->label('Contratación por transferencia')
            ->icon(Heroicon::OutlinedBanknotes)
            ->color('gray')
            ->modalHeading('Contratación pagada por transferencia')
            ->modalDescription('Se registra el pago y se genera un enlace para completar los datos del cliente y el contrato, igual que en una compra con Webpay. El enlace sirve por '.TransferPurchaseService::LINK_DAYS.' días.')
            ->modalSubmitActionLabel('Registrar y generar enlace')
            ->schema([
                Select::make('plan_id')
                    ->label('Plan')
                    ->options(fn (): array => Plan::query()->active()->orderBy('sort_order')->orderBy('name')->pluck('name', 'id')->all())
                    ->required()
                    ->native(false)
                    ->live()
                    ->afterStateUpdated(function ($state, Set $set): void {
                        $plan = $state ? Plan::query()->find($state) : null;
                        $set('amount', $plan?->total_price);
                    }),
                Select::make('flow')
                    ->label('Tipo')
                    ->options(['checkout' => 'Contratación nueva', 'renewal' => 'Renovación'])
                    ->default('checkout')
                    ->required()
                    ->native(false),
                TextInput::make('email')
                    ->label('Correo del cliente')
                    ->email()
                    ->required()
                    ->maxLength(150),
                TextInput::make('phone')
                    ->label('WhatsApp / teléfono')
                    ->tel()
                    ->required()
                    ->maxLength(30),
                TextInput::make('amount')
                    ->label('Monto pagado')
                    ->numeric()
                    ->integer()
                    ->minValue(1)
                    ->prefix('$')
                    ->required()
                    ->helperText('Se completa con el precio del plan. Cámbialo si el cliente pagó otro monto.'),
                TextInput::make('reference')
                    ->label('Referencia de la transferencia')
                    ->maxLength(30)
                    ->helperText('Opcional. Por ejemplo, el número de operación del banco.'),
            ])
            ->action(function (array $data, TransferPurchaseService $transfers): void {
                $plan = Plan::query()->active()->findOrFail($data['plan_id']);
                $purchase = $transfers->create(
                    $plan,
                    (string) $data['flow'],
                    (string) $data['email'],
                    (string) $data['phone'],
                    (int) $data['amount'],
                    $data['reference'] ?? null,
                );
                $link = $transfers->link($purchase);

                Notification::make()
                    ->title('Pago por transferencia registrado')
                    ->body('Copia este enlace para completar los datos y el contrato (puedes enviárselo al cliente). Sirve por '.TransferPurchaseService::LINK_DAYS." días:\n\n".$link)
                    ->success()
                    ->persistent()
                    ->actions([
                        Action::make('open')
                            ->label('Abrir enlace')
                            ->url($link, shouldOpenInNewTab: true),
                    ])
                    ->send();
            });
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ClientStatsOverview::class,
            ClientPlanDistributionChart::class,
        ];
    }
}
