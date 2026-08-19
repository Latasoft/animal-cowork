<x-mail::message>
# Reserva confirmada

Tu reserva de sala de reuniones fue confirmada correctamente.

**Cliente:** {{ $reservation->contact_name }}  
**Empresa:** {{ $reservation->client?->company_name ?? 'Cliente externo' }}  
**RUT empresa:** {{ $reservation->client?->company_rut ?? 'No informado' }}

**Sala:** {{ $reservation->room->name }}  
**Fecha:** {{ $reservation->starts_at->locale('es')->isoFormat('D [de] MMMM [de] YYYY') }}  
**Horario:** {{ $reservation->starts_at->format('H:i') }} – {{ $reservation->starts_at->addMinutes($reservation->duration_minutes)->format('H:i') }}

**Horas reservadas:** {{ $reservation->duration_minutes / 60 }}  
@if ($reservation->included_minutes_used > 0)
**Horas incluidas utilizadas:** {{ $reservation->included_minutes_used / 60 }}  
@endif
@if ($reservation->billable_minutes > 0)
**Horas adicionales:** {{ $reservation->billable_minutes / 60 }}  
**Tarifa aplicada:** ${{ number_format($reservation->rate_per_hour_net, 0, ',', '.') }} netos por hora  
@endif
**Total pagado:** ${{ number_format($reservation->total_amount, 0, ',', '.') }} CLP  
**Estado:** Confirmada

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
