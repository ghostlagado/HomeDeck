const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

function isLocalHost(hostname) {
  return (
    LOCAL_HOSTS.has(hostname) ||
    hostname.endsWith('.local') ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

export function normalizeAppUrl(input) {
  const trimmed = String(input || '').trim();

  if (!trimmed) {
    throw new Error('Informe o endereço do aplicativo.');
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed;

  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error('Endereço inválido. Ex.: https://www.youtube.com');
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Utilize um endereço HTTP ou HTTPS.');
  }

  if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
    throw new Error('Endereços HTTP só são permitidos para dispositivos locais.');
  }

  return parsed.href;
}
