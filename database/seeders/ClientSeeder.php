<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'contract_type' => 'legal',

                'email' => 'contacto@bosquesur.test',
                'phone' => '+56961234567',

                'representative_name' => 'Camila Andrea Soto Pérez',
                'representative_rut' => '17456321-7',

                'address' => 'Av. Providencia 1450, Depto. 602',
                'commune' => 'Providencia',
                'region' => 'Región Metropolitana',

                'company_name' => 'Bosque Sur SpA',
                'company_rut' => '77123456-9',

                'status' => 'active',
                'notes' => 'Cliente ficticio para pruebas de persona jurídica.',
            ],

            [
                'contract_type' => 'natural',

                'email' => 'matias.rivera@example.test',
                'phone' => '+56972345678',

                'representative_name' => 'Matías Ignacio Rivera López',
                'representative_rut' => '18567432-0',

                'address' => 'Los Alerces 820',
                'commune' => 'Puerto Montt',
                'region' => 'Región de Los Lagos',

                // Persona natural con giro:
                // nombre y RUT comercial coinciden con el contratante.
                'company_name' => 'Matías Ignacio Rivera López',
                'company_rut' => '18567432-0',

                'status' => 'active',
                'notes' => 'Persona natural con giro para pruebas.',
            ],

            [
                'contract_type' => 'legal',

                'email' => 'administracion@nortecreativo.test',
                'phone' => '+56983456789',

                'representative_name' => 'Fernanda Paz Morales Díaz',
                'representative_rut' => '16234567-2',

                'address' => 'Manuel Montt 425, Oficina 301',
                'commune' => 'Providencia',
                'region' => 'Región Metropolitana',

                'company_name' => 'Norte Creativo Limitada',
                'company_rut' => '76876543-K',

                'status' => 'active',
                'notes' => null,
            ],

            [
                'contract_type' => 'legal',

                'email' => 'hola@patagoniasoft.test',
                'phone' => '+56994567890',

                'representative_name' => 'Sebastián Andrés Muñoz Vera',
                'representative_rut' => '19345678-2',

                'address' => 'Benavente 640',
                'commune' => 'Puerto Montt',
                'region' => 'Región de Los Lagos',

                'company_name' => 'Patagonia Soft SpA',
                'company_rut' => '77987654-3',

                'status' => 'inactive',
                'notes' => 'Cliente inactivo para probar filtros administrativos.',
            ],

            [
                'contract_type' => 'natural',

                'email' => 'valentina.contreras@example.test',
                'phone' => '+56955667788',

                'representative_name' => 'Valentina Ignacia Contreras Silva',
                'representative_rut' => '20123456-5',

                'address' => 'Las Camelias 1175',
                'commune' => 'Ñuñoa',
                'region' => 'Región Metropolitana',

                'company_name' => 'Valentina Ignacia Contreras Silva',
                'company_rut' => '20123456-5',

                'status' => 'active',
                'notes' => 'Persona natural con giro para probar contrataciones y reservas.',
            ],
        ];

        foreach ($clients as $client) {
            Client::updateOrCreate(
                ['company_name' => $client['company_name']],
                $client,
            );
        }
    }
}
