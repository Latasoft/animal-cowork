<?php

namespace App\Filament\Resources\CompanyFormationServices\Schemas;

use App\Models\CompanyFormationService;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CompanyFormationServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /*
                |--------------------------------------------------------------------------
                | Identificación y presentación
                |--------------------------------------------------------------------------
                */

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
                                fn (?CompanyFormationService $record): bool =>
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
                                    ?CompanyFormationService $record,
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

                /*
                |--------------------------------------------------------------------------
                | Servicio externo
                |--------------------------------------------------------------------------
                */

                Section::make('Servicio externo')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('external_service_label')
                            ->label('Etiqueta')
                            ->maxLength(255),

                        TextInput::make('external_service_title')
                            ->label('Título')
                            ->maxLength(255),

                        TextInput::make('external_service_price')
                            ->label('Precio')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->prefix('$'),

                        Textarea::make('external_service_description')
                            ->label('Descripción')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Oficina virtual
                |--------------------------------------------------------------------------
                */

                Section::make('Oficina virtual')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('virtual_office_label')
                            ->label('Etiqueta')
                            ->maxLength(255),

                        TextInput::make('virtual_office_title')
                            ->label('Título')
                            ->maxLength(255),

                        TextInput::make('virtual_office_price')
                            ->label('Precio')
                            ->numeric()
                            ->integer()
                            ->minValue(0)
                            ->prefix('$'),

                        TextInput::make('virtual_office_duration')
                            ->label('Duración')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Información del servicio
                |--------------------------------------------------------------------------
                */

                Section::make('Información del servicio')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('service_section_eyebrow')
                            ->label('Eyebrow')
                            ->maxLength(255),

                        TextInput::make('service_section_title')
                            ->label('Título')
                            ->maxLength(255),

                        Textarea::make('service_section_description')
                            ->label('Descripción')
                            ->rows(4)
                            ->columnSpanFull(),

                        Repeater::make('requirements')
                            ->label('Requisitos')
                            ->simple(
                                TextInput::make('requirement')
                                    ->label('Requisito')
                                    ->required()
                                    ->maxLength(255),
                            )
                            ->addActionLabel('Agregar requisito')
                            ->reorderable()
                            ->columnSpanFull(),

                        Textarea::make('foreigner_notice')
                            ->label('Información para extranjeros')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Servicios incluidos
                |--------------------------------------------------------------------------
                */

                Section::make('Servicios incluidos')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('included_services_title')
                            ->label('Título')
                            ->maxLength(255),

                        Repeater::make('included_services')
                            ->label('Servicios incluidos')
                            ->simple(
                                TextInput::make('service')
                                    ->label('Servicio')
                                    ->required()
                                    ->maxLength(255),
                            )
                            ->addActionLabel('Agregar servicio')
                            ->reorderable()
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Contacto
                |--------------------------------------------------------------------------
                */

                Section::make('Contacto')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('contact_title')
                            ->label('Título')
                            ->maxLength(255),

                        Textarea::make('contact_description')
                            ->label('Descripción')
                            ->rows(4)
                            ->columnSpanFull(),

                        TextInput::make('contact_email')
                            ->label('Email')
                            ->email()
                            ->maxLength(255),

                        TextInput::make('contact_whatsapp')
                            ->label('WhatsApp')
                            ->maxLength(50),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Botón principal
                |--------------------------------------------------------------------------
                */

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

                /*
                |--------------------------------------------------------------------------
                | Publicación
                |--------------------------------------------------------------------------
                */

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

    /**
     * Determina si la imagen pertenece a public/images/
     * en lugar de storage/app/public/.
     */
    private static function isBundledServiceImage(
        ?string $path,
    ): bool {
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
     * Permite a Filament mostrar correctamente:
     *
     * - imágenes antiguas ubicadas en public/images/
     * - imágenes nuevas ubicadas en storage/app/public/
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