<?php

namespace Database\Seeders;

use App\Models\CompanyFormationService;
use Illuminate\Database\Seeder;

class CompanyFormationServiceSeeder extends Seeder
{
    public function run(): void
    {
        CompanyFormationService::updateOrCreate(
            [
                'slug' => 'constitucion-empresa',
            ],
            [
                'eyebrow' => 'Servicio para clientes Animal Co-work',

                'title' => 'Constitución de Empresa + Inicio de Actividades + Oficina Virtual 2 años',

                'description' => 'Obtén la constitución de tu sociedad, realiza el inicio de actividades ante el SII y contrata tu Oficina Virtual Animal Co-work por 2 años.',

                /*
                 * Servicio externo
                 */
                'external_service_label' => 'Servicio adicional externo',

                'external_service_title' => 'Constitución de Empresa + Inicio de Actividades',

                'external_service_price' => 35000,

                'external_service_description' => 'Valor exclusivo al contratar una Oficina Virtual Animal Co-work.',

                /*
                 * Oficina Virtual
                 */
                'virtual_office_label' => 'Oficina Virtual Animal Co-work',

                'virtual_office_title' => 'Oficina Virtual',

                'virtual_office_price' => 59990,

                'virtual_office_duration' => '2 años',

                /*
                 * Sección principal del servicio
                 */
                'service_section_eyebrow' => 'Constitución e iniciación de empresas',

                'service_section_title' => 'Obtén tu empresa legalmente constituida y con RUT ante el SII',

                'service_section_description' => 'El servicio de creación de empresa permite obtener tu empresa legalmente constituida y realizar el proceso de inicio de actividades ante el Servicio de Impuestos Internos.',

                'requirements' => [
                    'Clave personal del Servicio de Impuestos Internos (SII).',
                    'Clave Única del Registro Civil.',
                    'Cédula de identidad vigente.',
                ],

                'foreigner_notice' => 'En el caso de extranjeros, las cédulas deben encontrarse vigentes. El representante legal de la empresa debe contar con permanencia definitiva. Los socios pueden contar con permanencia temporal.',

                /*
                 * Servicios incluidos
                 */
                'included_services_title' => '¿Qué incluye el servicio?',

                'included_services' => [
                    'Constitución de empresa.',
                    'Inicio de actividades ante el SII.',
                    'Verificación de actividades.',
                    'Activación del proceso de facturación.',
                    'Oficina Virtual Animal Co-work por 2 años.',
                ],

                /*
                 * Contacto
                 */
                'contact_title' => '¿Necesitas ayuda antes de contratar?',

                'contact_description' => 'Puedes comunicarte directamente con nuestro equipo para resolver dudas sobre el servicio.',

                'contact_email' => 'oficinavirtual@animalcoworking.cl',

                'contact_whatsapp' => '+56990556983',

                /*
                 * Imagen
                 */
                'image' => '/images/plans/constitucion.jpg',

                'image_alt' => 'Constitución de empresa, inicio de actividades y oficina virtual Animal Co-work',

                /*
                 * CTA
                 */
                'primary_action_label' => 'CONTRATAR AHORA',

                'primary_action_href' => '#contratar',

                /*
                 * Publicación
                 */
                'is_active' => true,

                'sort_order' => 1,
            ],
        );
    }
}