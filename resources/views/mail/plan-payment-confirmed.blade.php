<x-mail::message>
# Pago confirmado correctamente

Recibimos el pago de tu plan **{{ $details['name'] }}**.

**Monto:** ${{ number_format($details['amount'], 0, ',', '.') }} CLP

**Referencia:** {{ $details['reference'] }}

Ahora completa tus datos y confirma el contrato para activar tu plan.

<x-mail::button :url="$details['continuation_url']">
Completar datos del plan
</x-mail::button>

Animal Co-work
</x-mail::message>
