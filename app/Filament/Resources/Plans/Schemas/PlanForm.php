<?php

namespace App\Filament\Resources\Plans\Schemas;

use App\Models\Plan;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PlanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identificación y presentación')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('name')
                            ->label('Nombre')
                            ->required()
                            ->maxLength(100),
                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(50)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->unique(ignoreRecord: true)
                            ->helperText('Cambiar un slug existente modifica las URLs públicas de checkout.'),
                        TextInput::make('badge')
                            ->label('Badge')
                            ->maxLength(100),
                        Select::make('theme')
                            ->label('Tema')
                            ->options(Plan::THEMES)
                            ->required(),
                        FileUpload::make('image_path')
                            ->label('Imagen')
                            ->disk('public')
                            ->directory('plans')
                            ->visibility('public')
                            ->storeFiles()
                            ->preventFilePathTampering()
                            ->fetchFileInformation(fn (?Plan $record): bool => ! self::isBundledPlanImage($record?->image_path))
                            ->getUploadedFileUsing(
                                fn (FileUpload $component, string $file, string|array|null $storedFileNames): ?array => self::getUploadedFile(
                                    $component,
                                    $file,
                                    $storedFileNames,
                                ),
                            )
                            ->dehydrated(fn (?Plan $record, mixed $state): bool => filled($state) || blank($record?->image_path))
                            ->image()
                            ->acceptedFileTypes([
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                            ])
                            ->rules(['extensions:jpg,jpeg,png,webp'])
                            ->maxSize(4096)
                            ->helperText('Formatos permitidos: JPG, JPEG, PNG y WebP; máximo 4 MB.'),
                        TextInput::make('image_alt')
                            ->label('Texto alternativo')
                            ->maxLength(255),
                    ])
                    ->columns(2),
                Section::make('Precios y contrato')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('price_office')
                            ->label('Precio oficina')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->prefix('$')
                            ->required(),
                        TextInput::make('price_additional')
                            ->label('Precio adicional')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->prefix('$')
                            ->default(0)
                            ->required(),
                        TextInput::make('contract_duration_months')
                            ->label('Duración del contrato (meses)')
                            ->numeric()
                            ->integer()
                            ->minValue(1)
                            ->required(),
                        TextInput::make('sort_order')
                            ->label('Orden')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                        Repeater::make('features')
                            ->label('Características')
                            ->simple(
                                TextInput::make('feature')
                                    ->label('Característica')
                                    ->required()
                                    ->maxLength(255),
                            )
                            ->addActionLabel('Agregar característica')
                            ->reorderable()
                            ->minItems(1)
                            ->required()
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Section::make('Beneficio de sala de reuniones')
                    ->columnSpanFull()
                    ->schema([
                        Toggle::make('includes_room_access')
                            ->label('Incluye acceso a sala')
                            ->live(),
                        TextInput::make('monthly_room_minutes_included')
                            ->label('Minutos incluidos al mes')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                        Toggle::make('room_minutes_rollover')
                            ->label('Minutos acumulables'),
                        TextInput::make('extra_room_hour_price_net')
                            ->label('Hora adicional neta')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->prefix('$'),
                        Toggle::make('extra_room_hour_taxable')
                            ->label('Hora adicional afecta a IVA')
                            ->default(true),
                    ])
                    ->columns(2),
                Section::make('Publicación')
                    ->columnSpanFull()
                    ->schema([
                        Toggle::make('is_featured')
                            ->label('Destacado'),
                        Toggle::make('is_active')
                            ->label('Activo')
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }

    private static function isBundledPlanImage(?string $path): bool
    {
        if (blank($path) || ! Str::startsWith($path, '/images/plans/')) {
            return false;
        }

        $filename = Str::after($path, '/images/plans/');

        return basename($filename) === $filename
            && is_file(public_path("images/plans/{$filename}"));
    }

    /**
     * @param  string|array<string, string>|null  $storedFileNames
     * @return array{name: string, size: int, type: string|null, url: string}|null
     */
    private static function getUploadedFile(FileUpload $component, string $file, string|array|null $storedFileNames): ?array
    {
        if (! self::isBundledPlanImage($file)) {
            return $component->getUploadedFile($file, $storedFileNames);
        }

        $publicPath = public_path(ltrim($file, '/'));

        return [
            'name' => basename($file),
            'size' => File::size($publicPath),
            'type' => File::mimeType($publicPath) ?: null,
            'url' => url($file),
        ];
    }
}
