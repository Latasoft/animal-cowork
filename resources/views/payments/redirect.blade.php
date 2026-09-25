<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>Redirigiendo a Webpay…</title>
<style>
    html, body { margin: 0; height: 100%; background: #ffffff; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #0f1f3d; }
    main { min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; box-sizing: border-box; }
    .spinner { width: 48px; height: 48px; border: 4px solid #e5e7eb; border-top-color: #6bb13d; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 24px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h1 { font-size: 20px; margin: 0 0 8px; }
    p { font-size: 15px; margin: 0; color: #5b6475; }
    button { margin-top: 24px; background: #6bb13d; color: #ffffff; border: 0; border-radius: 8px; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
<main>
    <div class="spinner" aria-hidden="true"></div>
    <h1>Te estamos llevando a Webpay…</h1>
    <p>Espera un momento, no cierres esta ventana.</p>
    <form id="webpay" method="post" action="{{ $payment->redirect_url }}">
        <input type="hidden" name="token_ws" value="{{ $payment->token }}">
        <noscript><button type="submit">Continuar a Webpay</button></noscript>
    </form>
</main>
<script>document.getElementById('webpay').submit();</script>
</body>
</html>
