const express = require('express');
const helmet = require('helmet');

const app = express();
const PORT = 3000;

// Trust proxy headers (important when behind Cloudflare or Nginx)
app.set('trust proxy', true);

app.use(helmet());

// Allowed IPs
const allowedIPs = new Set([
  '2401:4900:8841:fa80:419c:e43f:75b2:7f2a',
  '192.168.1.28',
  '106.219.155.126'
]);

// Middleware to allow only specific IPs
function ipValidator(req, res, next) {
  const ip = req.ip;

  // Strip IPv6-mapped IPv4 prefix if present
  const cleanIP = ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;

  console.log(`Client IP: ${ip} (cleaned: ${cleanIP})`);

  if (allowedIPs.has(cleanIP)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: IP not allowed', ip: cleanIP });
  }
}

app.use(ipValidator);

// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the allowed IP!', ip: req.ip });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
