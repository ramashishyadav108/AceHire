export function pingBackend() {
  fetch('https://AceHire-jm7u.onrender.com', { method: 'GET' })
    .then(() => {/* success, do nothing */})
    .catch(() => {/* ignore errors */});
} 