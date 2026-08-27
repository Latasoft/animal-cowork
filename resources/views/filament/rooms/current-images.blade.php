@php
    $images = $images ?? [];
@endphp

@if (count($images))
    <div
        style="
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        "
    >
        @foreach ($images as $index => $image)
            <div
                style="
                    position: relative;
                    width: 120px;
                    height: 90px;
                    flex: 0 0 120px;
                    overflow: hidden;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    background: #f9fafb;
                "
            >
                <img
                    src="{{ url($image) }}"
                    alt="Imagen de la sala"
                    style="
                        display: block;
                        width: 120px;
                        height: 90px;
                        max-width: 120px;
                        max-height: 90px;
                        object-fit: cover;
                    "
                >

                <button
                    type="button"
                    wire:click="removeImage({{ $index }})"
                    wire:confirm="¿Seguro que quieres eliminar esta imagen?"
                    style="
                        position: absolute;
                        top: 6px;
                        right: 6px;
                        width: 24px;
                        height: 24px;
                        padding: 0;
                        border: 0;
                        border-radius: 9999px;
                        background: #dc2626;
                        color: white;
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 24px;
                        text-align: center;
                        cursor: pointer;
                    "
                    title="Eliminar imagen"
                >
                    ×
                </button>
            </div>
        @endforeach
    </div>
@else
    <div
        style="
            padding: 24px;
            border: 1px dashed #d1d5db;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        "
    >
        No hay imágenes cargadas para esta sala.
    </div>
@endif