<?php

namespace App\Filament\Resources\PatentManagementServices\Schemas;

use App\Models\PatentManagementService;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PatentManagementServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identificación y presentación')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(100)
                            ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                            ->unique(ignoreRecord: true),

                        TextInput::make('eyebrow')
                            ->label('Eyebrow')
                            ->maxLength(255),

                        TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255),

                        Textarea::make('description')
                            ->label('Descripción')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),

                        FileUpload::make('image')
                            ->label('Imagen principal')
                            ->disk('public')
                            ->directory('services')
                            ->visibility('public')
                            ->storeFiles()
                            ->image()
                            ->acceptedFileTypes([
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                            ])
                            ->rules([
                                'extensions:jpg,jpeg,png,webp',
                            ])
                            ->maxSize(4096)
                            ->imagePreviewHeight('250')
                            ->panelLayout('integrated')
                            ->fetchFileInformation(
                                fn (?PatentManagementService $record): bool =>
                                    ! self::isBundledServiceImage(
                                        $record?->image,
                                    ),
                            )
                            ->getUploadedFileUsing(
                                fn (
                                    FileUpload $component,
                                    string $file,
                                    string|array|null $storedFileNames,
                                ): ?array => self::getUploadedFile(
                                    $component,
                                    $file,
                                    $storedFileNames,
                                ),
                            )
                            ->dehydrated(
                                fn (
                                    ?PatentManagementService $record,
                                    mixed $state,
                                ): bool =>
                                    filled($state)
                                    || blank($record?->image),
                            )
                            ->automaticallyResizeImagesMode('contain')
                            ->automaticallyResizeImagesToWidth('1600')
                            ->automaticallyResizeImagesToHeight('1200')
                            ->automaticallyUpscaleImagesWhenResizing(false)
                            ->helperText(
                                'Sube una imagen JPG, JPEG, PNG o WebP. Se optimiza automáticamente. Máximo 4 MB.',
                            ),

                        TextInput::make('image_alt')
                            ->label('Texto alternativo')
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Información del servicio')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('service_section_title')
                            ->label('Título de sección')
                            ->maxLength(255),

                        Textarea::make('service_section_description')
                            ->label('Descripción de sección')
                            ->rows(4)
                            ->columnSpanFull(),

                        Textarea::make('legal_notice')
                            ->label('Aviso legal')
                            ->rows(5)
                            ->columnSpanFull(),

                        Textarea::make('municipal_payment_detail')
                            ->label('Información sobre pago municipal')
                            ->rows(6)
                            ->columnSpanFull(),

                        Textarea::make('exclusive_notice')
                            ->label('Aviso comercial')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Precio')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('service_price')
                            ->label('Precio del servicio')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->prefix('$')
                            ->required(),

                        TextInput::make('currency')
                            ->label('Moneda')
                            ->default('CLP')
                            ->required()
                            ->maxLength(3),
                    ])
                    ->columns(2),

                Section::make('Botón principal')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('primary_action_label')
                            ->label('Texto del botón')
                            ->maxLength(255),

                        TextInput::make('primary_action_href')
                            ->label('Enlace del botón')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Section::make('Publicación')
                    ->columnSpanFull()
                    ->schema([
                        Toggle::make('is_active')
                            ->label('Activo')
                            ->default(true),

                        TextInput::make('sort_order')
                            ->label('Orden')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                    ])
                    ->columns(2),
            ]);
    }

    private static function isBundledServiceImage(?string $path): bool
    {
        if (
            blank($path)
            || ! Str::startsWith($path, '/images/')
        ) {
            return false;
        }

        $publicPath = public_path(ltrim($path, '/'));

        return is_file($publicPath);
    }

    /**
     * Permite que Filament muestre correctamente
     * imágenes existentes dentro de public/images/ además
     * de las imágenes almacenadas en storage/app/public.
     *
     * @param string|array<string, string>|null $storedFileNames
     * @return array{
     *     name: string,
     *     size: int,
     *     type: string|null,
     *     url: string
     * }|null
     */
    private static function getUploadedFile(
        FileUpload $component,
        string $file,
        string|array|null $storedFileNames,
    ): ?array {
        if (! self::isBundledServiceImage($file)) {
            return $component->getUploadedFile(
                $file,
                $storedFileNames,
            );
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
