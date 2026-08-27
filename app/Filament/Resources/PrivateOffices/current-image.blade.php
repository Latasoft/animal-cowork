@php
    $image = $image ?? null;
@endphp

@if ($image)
    <div
        style="
            display: flex;
            align-items: center;
            gap: 16px;
        "
    >
        <div
            style="
                width: 220px;
                height: 160px;
                overflow: hidden;
                border-radius: 10px;
                border: 1px solid #e5e7eb;
                background: #f9fafb;
            "
        >
            <img
                src="{{ url($image) }}"
                alt="Imagen actual de la oficina"
                style="
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                "
            >
        </div>

        <div>
            <p
                style="
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                "
            >
                Imagen actual
            </p>

            <p
                style="
                    margin: 4px 0 0;
                    font-size: 12px;
                    color: #6b7280;
                    word-break: break-all;
                "
            >
                {{ $image }}
            </p>
        </div>
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
        No hay una imagen cargada para esta oficina.
    </div>
@endif
