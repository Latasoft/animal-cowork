<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the private offices page is public', function () {
    $response = $this->get(route('private_offices.index'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('private-offices'));
});

test('the private offices media is available locally', function (string $path) {
    expect(public_path($path))->toBeFile();
})->with([
    'hero image' => 'images/plans/OFICINAS-PRIVADAS.jpg',
    'office 2 image' => 'images/plans/ofice2.jpg',
    'office 3 image' => 'images/plans/ofice3.jpg',
    'office 4 image' => 'images/plans/ofice4.jpg',
    'office 5 image' => 'images/plans/ofice5.jpg',
    'office 7 image' => 'images/plans/ofice7.jpg',
    'office 9 image' => 'images/plans/ofice9.jpg',
    'requirements document' => 'images/plans/REQUISITOS-ARRENDAMIENTO-ANIMAL-COWORKING..pdf',
]);
