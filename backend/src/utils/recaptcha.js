/**
 * Vérification du token reCAPTCHA v2 auprès de Google.
 * En l'absence de RECAPTCHA_SECRET_KEY, on accepte uniquement le token "dev-bypass".
 */

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function verifyRecaptcha(token, remoteip = null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return token === 'dev-bypass';
  }
  if (!token || typeof token !== 'string') {
    return false;
  }

  const params = new URLSearchParams({
    secret,
    response: token,
    ...(remoteip && { remoteip }),
  });

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}
