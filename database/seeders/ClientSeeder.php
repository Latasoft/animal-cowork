<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Planes existentes
        |--------------------------------------------------------------------------
        |
        | No escribimos nombres de planes manualmente.
        | El seeder utiliza todos los planes existentes en la BD.
        |
        */

        $plans = Plan::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        if ($plans->isEmpty()) {
            $this->command?->warn(
                'No existen planes en la base de datos. Ejecuta PlanSeeder primero.'
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Datos base
        |--------------------------------------------------------------------------
        */

        $firstNames = [
            'Santiago',
            'Camila',
            'Matías',
            'Fernanda',
            'Sebastián',
            'Valentina',
            'Diego',
            'Constanza',
            'Felipe',
            'Javiera',
            'Nicolás',
            'Antonia',
            'Cristóbal',
            'Daniela',
            'Tomás',
            'Francisca',
            'Andrés',
            'Catalina',
            'Gabriel',
            'Martina',
        ];

        $lastNames = [
            'Soto',
            'Pérez',
            'González',
            'Muñoz',
            'Rojas',
            'Díaz',
            'Contreras',
            'Silva',
            'Martínez',
            'Sepúlveda',
            'Morales',
            'Rodríguez',
            'Vargas',
            'Castillo',
            'Espinoza',
        ];

        $communes = [
            'Providencia',
            'Las Condes',
            'Ñuñoa',
            'Santiago',
            'La Reina',
            'Vitacura',
            'Puerto Montt',
            'Puerto Varas',
            'Frutillar',
            'Osorno',
        ];

        $regions = [
            'Región Metropolitana',
            'Región de Los Lagos',
        ];

        /*
        |--------------------------------------------------------------------------
        | Distribución de estados
        |--------------------------------------------------------------------------
        |
        | 50 clientes:
        |
        | 30 activos
        | 10 por vencer
        | 7 vencidos
        | 3 sin suscripción
        |
        */

        $clientDefinitions = [];

        for ($i = 1; $i <= 50; $i++) {
            $firstName = $firstNames[($i - 1) % count($firstNames)];
            $lastName = $lastNames[($i - 1) % count($lastNames)];

            $secondLastName = $lastNames[
                intdiv($i - 1, count($lastNames)) % count($lastNames)
            ];

            $fullName = "{$firstName} {$lastName} {$secondLastName}";

            /*
            |--------------------------------------------------------------------------
            | Tipo de cliente
            |--------------------------------------------------------------------------
            */

            $contractType = $i % 3 === 0
                ? 'natural'
                : 'legal';

            /*
            |--------------------------------------------------------------------------
            | Empresa
            |--------------------------------------------------------------------------
            */

            if ($contractType === 'natural') {
                $companyName = $fullName;
            } else {
                $companyName = match ($i % 6) {
                    0 => "Andes {$lastName} SpA",
                    1 => "Patagonia {$lastName} SpA",
                    2 => "{$lastName} & Asociados Ltda.",
                    3 => "Sur {$firstName} SpA",
                    4 => "Norte {$lastName} Limitada",
                    default => "Grupo {$lastName} SpA",
                };
            }

            /*
            |--------------------------------------------------------------------------
            | RUT ficticio
            |--------------------------------------------------------------------------
            */

            $companyRutNumber = 77000000 + $i;

            $companyRut = $companyRutNumber . '-' . $this->rutDv(
                $companyRutNumber
            );

            $representativeRutNumber = 15000000 + $i;

            $representativeRut = $representativeRutNumber . '-' . $this->rutDv(
                $representativeRutNumber
            );

            /*
            |--------------------------------------------------------------------------
            | Estado administrativo del cliente
            |--------------------------------------------------------------------------
            */

            $status = match ($i % 5) {
                0 => 'inactive',
                default => 'active',
            };

            /*
            |--------------------------------------------------------------------------
            | Datos
            |--------------------------------------------------------------------------
            */

            $clientDefinitions[] = [
                'contract_type' => $contractType,

                'email' => strtolower(
                    str_replace(' ', '.', $fullName)
                ) . ".{$i}@example.test",

                'phone' => '+569' . str_pad(
                    (string) (60000000 + $i),
                    8,
                    '0',
                    STR_PAD_LEFT
                ),

                'representative_name' => $fullName,

                'representative_rut' => $representativeRut,

                'address' => "{$i} Avenida Principal {$i}",

                'commune' => $communes[
                    ($i - 1) % count($communes)
                ],

                'region' => $regions[
                    ($i - 1) % count($regions)
                ],

                'company_name' => $companyName,

                'company_rut' => $companyRut,

                'status' => $status,

                'notes' => "Cliente ficticio de pruebas #{$i}.",
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Crear clientes y suscripciones
        |--------------------------------------------------------------------------
        */

        DB::transaction(function () use (
            $clientDefinitions,
            $plans
        ): void {
            foreach ($clientDefinitions as $index => $clientData) {
                $clientNumber = $index + 1;

                $client = Client::updateOrCreate(
                    [
                        'company_rut' => $clientData['company_rut'],
                    ],
                    $clientData
                );

                /*
                |--------------------------------------------------------------------------
                | Limpiar suscripciones anteriores del cliente de prueba
                |--------------------------------------------------------------------------
                */

                Subscription::query()
                    ->where('client_id', $client->id)
                    ->delete();

                /*
                |--------------------------------------------------------------------------
                | Clientes 48, 49 y 50
                |--------------------------------------------------------------------------
                |
                | Se dejan sin suscripción para probar este estado.
                |
                */

                if ($clientNumber >= 48) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Distribución automática de planes
                |--------------------------------------------------------------------------
                |
                | Los clientes se reparten entre TODOS los planes.
                |
                */

                $plan = $plans[
                    ($clientNumber - 1) % $plans->count()
                ];

                /*
                |--------------------------------------------------------------------------
                | Fechas
                |--------------------------------------------------------------------------
                |
                | 1 - 30  -> Activos
                | 31 - 40  -> Por vencer
                | 41 - 47  -> Vencidos
                |
                */

                $today = Carbon::today();

                if ($clientNumber <= 30) {
                    /*
                    | Activos:
                    | 31 a 365 días restantes.
                    */

                    $daysRemaining = match ($clientNumber % 6) {
                        0 => 31,
                        1 => 45,
                        2 => 60,
                        3 => 90,
                        4 => 180,
                        default => 365,
                    };

                    $startsAt = $today->copy()
                        ->subDays(
                            max(30, $daysRemaining - 365)
                        );

                    $endsAt = $today->copy()
                        ->addDays($daysRemaining);
                } elseif ($clientNumber <= 40) {
                    /*
                    | Por vencer:
                    | 0 a 30 días.
                    */

                    $daysRemaining = match ($clientNumber % 10) {
                        0 => 0,
                        1 => 1,
                        2 => 3,
                        3 => 7,
                        4 => 10,
                        5 => 14,
                        6 => 15,
                        7 => 21,
                        8 => 25,
                        default => 30,
                    };

                    $startsAt = $today->copy()
                        ->subYear();

                    $endsAt = $today->copy()
                        ->addDays($daysRemaining);
                } else {
                    /*
                    | Vencidos:
                    | diferentes antigüedades.
                    */

                    $daysExpired = match ($clientNumber) {
                        41 => 1,
                        42 => 7,
                        43 => 15,
                        44 => 30,
                        45 => 60,
                        46 => 90,
                        default => 365,
                    };

                    $startsAt = $today->copy()
                        ->subYear();

                    $endsAt = $today->copy()
                        ->subDays($daysExpired);
                }

                /*
                |--------------------------------------------------------------------------
                | Crear suscripción
                |--------------------------------------------------------------------------
                */

                Subscription::create([
                    'client_id' => $client->id,

                    'plan_id' => $plan->id,

                    'starts_at' => $startsAt,

                    'ends_at' => $endsAt,

                    'price_office' => $plan->price_office,

                    'price_additional' => $plan->price_additional,
                ]);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Resumen
        |--------------------------------------------------------------------------
        */

        $this->command?->info(
            '✓ Se generaron 50 clientes de prueba.'
        );

        $this->command?->info(
            '✓ Activos: 30'
        );

        $this->command?->info(
            '✓ Por vencer: 10'
        );

        $this->command?->info(
            '✓ Vencidos: 7'
        );

        $this->command?->info(
            '✓ Sin suscripción: 3'
        );

        $this->command?->info(
            '✓ Se utilizaron todos los planes existentes.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Cálculo de dígito verificador RUT
    |--------------------------------------------------------------------------
    */

    private function rutDv(int $rut): string
    {
        $sum = 0;
        $multiplier = 2;

        foreach (array_reverse(str_split((string) $rut)) as $digit) {
            $sum += ((int) $digit) * $multiplier;

            $multiplier++;

            if ($multiplier > 7) {
                $multiplier = 2;
            }
        }

        $remainder = 11 - ($sum % 11);

        return match ($remainder) {
            11 => '0',
            10 => 'K',
            default => (string) $remainder,
        };
    }
}