<?php

namespace Database\Seeders;

use App\Models\PatentManagementService;
use Illuminate\Database\Seeder;

class PatentManagementServiceSeeder extends Seeder
{
    public function run(): void
    {
        PatentManagementService::updateOrCreate(
            [
                'slug' => 'gestion-patente-comercial',
            ],
            [
                /*
                 * Contenido principal
                 */
                'eyebrow' => 'Servicio para clientes Animal Co-work',

                'title' => 'SERVICIO DE GESTIÓN DE PATENTE COMERCIAL DE OFICINA VIRTUAL',

                'description' => 'Animal Coworking, a través de este servicio, gestiona todo lo que necesitas para poder obtener la aprobación de tu patente comercial de oficina virtual desde la Municipalidad de Providencia.',

                /*
                 * Sección del servicio
                 */
                'service_section_title' => '¿Qué gestionamos?',

                'service_section_description' => 'Gestionamos el proceso necesario para solicitar la aprobación de tu patente comercial de oficina virtual ante la Municipalidad de Providencia.',

                /*
                 * Información legal
                 */
                'legal_notice' => 'Solicitar la patente comercial es una OBLIGACIÓN LEGAL para todo tipo de giro comercial, por tanto es sumamente importante que lo consideres dentro de la planificación económica de tu empresa.',

                /*
                 * Precio
                 */
                'service_price' => 50000,

                'currency' => 'CLP',

                /*
                 * Pago municipal
                 */
                'municipal_payment_detail' => 'Considera que el pago de tu patente de OFICINA VIRTUAL es libre de cobro por derecho de aseo y el valor es de $35.000 (aprox.) semestrales, que se paga dos veces al año: hasta el 31 de enero (primer periodo) y luego hasta el 31 de julio (segundo periodo). Este pago se realiza directamente a la municipalidad una vez aprobada tu patente luego de la solicitud inicial.',

                /*
                 * Aviso comercial
                 */
                'exclusive_notice' => 'Valores exclusivos clientes Animal Coworking.',

                /*
                 * Imagen
                 */
                'image' => '/images/plans/service.jpg',

                'image_alt' => 'Gestión de patente comercial de oficina virtual',

                /*
                 * CTA
                 */
                'primary_action_label' => 'CONTRATAR',

                'primary_action_href' => '#',

                /*
                 * Publicación
                 */
                'is_active' => true,

                'sort_order' => 1,
            ],
        );
    }
}