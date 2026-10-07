<x-mail::message>
@if ($isRenewal)
# Renovación de Oficina Virtual

Se registró una renovación de Oficina Virtual con los siguientes antecedentes.
@else
# Nueva contratación de Oficina Virtual

Se registró una nueva contratación de Oficina Virtual con los siguientes antecedentes.
@endif

**Tipo de contratación:** {{ $contractTypeLabel }}

**Nombre / representante:** {{ $displayName }}

**Correo electrónico:** {{ $client->email }}

**WhatsApp / teléfono:** {{ $client->phone }}

**RUT:** {{ $rut }}

@if ($companyName)
**Razón social:** {{ $companyName }}

@endif
**Plan contratado:** {{ $plan->name }}

**Monto pagado:** ${{ number_format($paidAmount, 0, ',', '.') }} CLP

@if ($payment)
@if (($payment['method'] ?? 'webpay') === 'transfer')
## Datos del pago (transferencia)

**Código interno:** {{ $payment['buy_order'] }}

**Referencia de la transferencia:** {{ $payment['authorization_code'] ?: 'No informada' }}
@else
## Datos del pago (Transbank)

**Orden de compra:** {{ $payment['buy_order'] }}

**Código de autorización:** {{ $payment['authorization_code'] ?: 'No informado' }}
@endif

**Fecha del pago:** {{ $payment['date'] ?: 'No informada' }}

@endif
Se adjunta el contrato PDF generado para su revisión y procesamiento.

Gracias,<br>
{{ config('app.name') }}
</x-mail::message>
