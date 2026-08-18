<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrador Animal',
                'email' => 'admin@animal.test',
                'password' => Hash::make('AnimalTest2026!'),
                'role' => 'super_admin',
                'status' => 'active',
            ],

            [
                'name' => 'Administración Animal',
                'email' => 'administracion@animal.test',
                'password' => Hash::make('AnimalTest2026!'),
                'role' => 'admin',
                'status' => 'active',
            ],

            [
                'name' => 'Ejecutivo Animal',
                'email' => 'ejecutivo@animal.test',
                'password' => Hash::make('AnimalTest2026!'),
                'role' => 'executive',
                'status' => 'active',
            ],

            [
                'name' => 'Recepción Animal',
                'email' => 'recepcion@animal.test',
                'password' => Hash::make('AnimalTest2026!'),
                'role' => 'reception',
                'status' => 'active',
            ],

            [
                'name' => 'Usuario Inactivo',
                'email' => 'inactivo@animal.test',
                'password' => Hash::make('AnimalTest2026!'),
                'role' => 'executive',
                'status' => 'inactive',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}