<x-mail::message>
# Pago realizado correctamente

Servicio contratado: **{{ $details['name'] }}**

Monto: **$ {{ number_format($details['amount'], 0, ',', '.') }} CLP**

Fecha: {{ \Carbon\CarbonImmutable::parse($details['date'])->timezone(config('app.timezone'))->format('d/m/Y H:i') }}

Referencia: {{ $details['reference'] }}

@if ($internal)
Correo del cliente: {{ $details['email'] }}

WhatsApp: {{ $details['phone'] }}

Estado: Pagado. Pendiente de gestión por el equipo.
@else
Nuestro equipo se comunicará contigo para revisar los antecedentes y coordinar los próximos pasos de tu solicitud.
@endif

Animal Co-work
</x-mail::message>

