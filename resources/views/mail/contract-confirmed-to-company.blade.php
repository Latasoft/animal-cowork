<x-mail::message>
# Nueva contratación de Oficina Virtual

Se registró una nueva contratación de Oficina Virtual con los siguientes antecedentes.

**Tipo de contratación:** {{ $contractTypeLabel }}  
**Nombre / representante:** {{ $displayName }}  
**Correo electrónico:** {{ $client->email }}  
**WhatsApp / teléfono:** {{ $client->phone }}  
**RUT:** {{ $rut }}  
@if ($companyName)
**Razón social:** {{ $companyName }}  
@endif
**Plan contratado:** {{ $plan->name }}  
**Precio del plan:** ${{ number_format($priceOffice, 0, ',', '.') }} CLP

Se adjunta el contrato PDF generado para su revisión y procesamiento.

Gracias,<br>
{{ config('app.name') }}
</x-mail::message>
