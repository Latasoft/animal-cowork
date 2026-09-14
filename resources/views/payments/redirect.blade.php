<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>Continuar a Webpay</title></head>
<body>
<main><h1>Te estamos enviando a Webpay</h1><p>Continúa para completar tu pago de forma segura.</p>
<form id="webpay" method="post" action="{{ $payment->redirect_url }}">
<input type="hidden" name="token_ws" value="{{ $payment->token }}">
<button type="submit">Continuar a Webpay</button>
</form></main>
<script>document.getElementById('webpay').submit();</script>
</body></html>
