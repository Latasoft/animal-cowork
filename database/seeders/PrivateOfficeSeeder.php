<?php

namespace Database\Seeders;

use App\Models\PrivateOffice;
use Illuminate\Database\Seeder;

class PrivateOfficeSeeder extends Seeder
{
    public function run(): void
    {
        $standardFeatures = [
            'Wifi',
            'Sala de reuniones',
            'Cocina',
            'Salas de espera y terraza',
            'Estacionamiento',
        ];

        $offices = [
            [
                'name' => 'Oficina 4',
                'slug' => 'oficina-4',
                'image' => '/images/plans/ofice4.jpg',
                'image_alt' => 'Interior de la Oficina 4 de Animal Co-work',
                'area_m2' => 11,
                'is_available' => false,
                'price' => 260000,
                'currency' => 'CLP',
                'expenses_included' => true,
                'features' => $standardFeatures,
                'sort_order' => 1,
                'is_visible' => true,
            ],
            [
                'name' => 'Oficina 2',
                'slug' => 'oficina-2',
                'image' => '/images/plans/ofice2.jpg',
                'image_alt' => 'Interior de la Oficina 2 de Animal Co-work',
                'area_m2' => 15,
                'is_available' => false,
                'price' => 340000,
                'currency' => 'CLP',
                'expenses_included' => true,
                'features' => $standardFeatures,
                'sort_order' => 2,
                'is_visible' => true,
            ],
            [
                'name' => 'Oficina 3',
                'slug' => 'oficina-3',
                'image' => '/images/plans/ofice3.jpg',
                'image_alt' => 'Interior de la Oficina 3 de Animal Co-work',
                'area_m2' => 20,
                'is_available' => false,
                'price' => 390000,
                'currency' => 'CLP',
                'expenses_included' => true,
                'features' => $standardFeatures,
                'sort_order' => 3,
                'is_visible' => true,
            ],
            [
                'name' => 'Oficina 5',
                'slug' => 'oficina-5',
                'image' => '/images/plans/ofice5.jpg',
                'image_alt' => 'Interior de la Oficina 5 de Animal Co-work',
                'area_m2' => 10.5,
                'is_available' => false,
                'price' => 260000,
                'currency' => 'CLP',
                'expenses_included' => true,
                'features' => $standardFeatures,
                'sort_order' => 4,
                'is_visible' => true,
            ],
            [
                'name' => 'Oficina 7',
                'slug' => 'oficina-7',
                'image' => '/images/plans/ofice7.jpg',
                'image_alt' => 'Interior de la Oficina 7 de Animal Co-work',
                'area_m2' => 9,
                'is_available' => false,
                'price' => 280000,
                'currency' => 'CLP',
                'expenses_included' => true,
                'features' => $standardFeatures,
                'sort_order' => 5,
                'is_visible' => true,
            ],
            [
                'name' => 'Oficina 9',
                'slug' => 'oficina-9',
                'image' => '/images/plans/ofice9.jpg',
                'image_alt' => 'Interior de la Oficina 9 de Animal Co-work',
                'area_m2' => 13.5,
                'is_available' => false,
                'price' => 340000,
                'currency' => 'CLP',
                'expenses_included' => true,
                'features' => [
                    'Aire acondicionado',
                    ...$standardFeatures,
                ],
                'sort_order' => 6,
                'is_visible' => true,
            ],
        ];

        foreach ($offices as $office) {
            PrivateOffice::updateOrCreate(
                [
                    'slug' => $office['slug'],
                ],
                $office,
            );
        }
    }
}