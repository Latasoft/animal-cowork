<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <title>Tu contratación de Oficina Virtual ha sido registrada</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6fb;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
                    <!-- Header -->
                    <tr>
                        <td align="left" style="padding:0 8px 20px;">
                            <img src="{{ $message->embed(public_path('images/Logo/logo.webp')) }}" alt="Animal Coworking" width="190" style="display:block; border:0; outline:none; text-decoration:none; width:190px; height:auto;">
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="background-color:#ffffff; border-radius:16px; border:1px solid #e6eaf2; overflow:hidden;">
                            <!-- Card accent -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td height="6" style="background-color:#6AAE3B; font-size:0; line-height:0;">&nbsp;</td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:40px 40px 24px;">
                                        <h1 style="margin:0 0 12px; font-size:24px; line-height:1.25; font-weight:700; color:#0D1B3D;">¡Solicitud recibida correctamente!</h1>
                                        <p style="margin:0; font-size:16px; line-height:1.6; color:#0D1B3D;">Hola {{ $displayName }},</p>
                                        <p style="margin:16px 0 0; font-size:16px; line-height:1.6; color:#3d4a6b;">
                                            Tu contratación de <strong style="color:#0D1B3D;">Oficina Virtual — Plan {{ $planName }}</strong> ha sido registrada y tu documentación fue generada correctamente.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Summary -->
                                <tr>
                                    <td style="padding:0 40px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6fb; border-radius:12px;">
                                            <tr>
                                                <td style="padding:24px;">
                                                    <p style="margin:0 0 16px; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; font-weight:700; color:#6AAE3B;">Resumen del servicio</p>
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="padding:6px 0; font-size:14px; color:#3d4a6b;">Plan contratado</td>
                                                            <td align="right" style="padding:6px 0; font-size:14px; font-weight:700; color:#0D1B3D;">{{ $planName }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:6px 0; font-size:14px; color:#3d4a6b;">Vigencia del contrato</td>
                                                            <td align="right" style="padding:6px 0; font-size:14px; font-weight:700; color:#0D1B3D;">{{ $durationMonths }} meses</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:6px 0; font-size:14px; color:#3d4a6b;">Renta</td>
                                                            <td align="right" style="padding:6px 0; font-size:14px; font-weight:700; color:#0D1B3D;">${{ number_format($priceOffice, 0, ',', '.') }}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Next step -->
                                <tr>
                                    <td style="padding:24px 40px 8px;">
                                        <p style="margin:0; font-size:16px; line-height:1.6; color:#3d4a6b;">
                                            En breve uno de nuestros ejecutivos se pondrá en contacto contigo para continuar con el proceso de <strong style="color:#0D1B3D;">firma electrónica</strong>.
                                        </p>
                                    </td>
                                </tr>

                                <!-- CTA -->
                                <tr>
                                    <td style="padding:8px 40px 40px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="border-radius:8px; background-color:#6AAE3B;">
                                                    <a href="https://www.animalcoworking.cl" target="_blank" style="display:inline-block; padding:14px 28px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:8px;">Visitar Animal Coworking</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:28px 8px 8px; text-align:center;">
                            <p style="margin:0 0 8px; font-size:13px; color:#0D1B3D; font-weight:700;">Animal Coworking Group SpA</p>
                            <p style="margin:0 0 4px; font-size:12px; line-height:1.6; color:#7a8699;">Eulogia Sánchez #065, Providencia, Santiago de Chile</p>
                            <p style="margin:0; font-size:12px; line-height:1.6; color:#7a8699;">
                                <a href="https://www.animalcoworking.cl" style="color:#6AAE3B; text-decoration:none;">www.animalcoworking.cl</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
