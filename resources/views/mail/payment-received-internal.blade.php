<x-mail::message>
# Nuevo pago recibido

Se aprobó un pago con Webpay. Con estos datos puede compararlo con el portal de Transbank.

**Tipo de compra:** {{ $details['kind'] }}
@if (! empty($details['flow']))
**Contratación:** {{ $details['flow'] }}
@endif
**Detalle:** {{ $details['product'] }}
**Monto:** ${{ number_format((int) $details['amount'], 0, ',', '.') }} CLP
**Fecha y hora:** {{ $details['date'] }}

## Datos de Transbank

**Orden de compra:** {{ $details['buy_order'] }}
**Código de autorización:** {{ $details['authorization_code'] ?: 'No informado' }}

## Datos del cliente

@if (! empty($details['company']))
**Empresa:** {{ $details['company'] }}
@endif
@if (! empty($details['rut']))
**RUT:** {{ $details['rut'] }}
@endif
@if (! empty($details['name']))
**Nombre de contacto:** {{ $details['name'] }}
@endif
**Correo:** {{ $details['email'] ?: 'No informado' }}
**Teléfono / WhatsApp:** {{ $details['phone'] ?: 'No informado' }}

@if (! empty($details['note']))
{{ $details['note'] }}
@endif

Saludos,<br>
{{ config('app.name') }}
</x-mail::message>
