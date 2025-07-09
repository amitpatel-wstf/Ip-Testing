const express = require('express');
const helmet = require('helmet');

const ipfilter = require('express-ipfilter').IpFilter

// Deny the following IPs
const ips = ['127.0.0.1', '192.168.1.28', '106.219.155.126', '2401:4900:8841:fa80:419c:e43f:75b2:7f2a']

const app = express();
const PORT = 3000;

// Enable proxy trust if behind something like Nginx
app.set('trust proxy', false);
app.use(helmet());
app.use(ipfilter(ips, { mode: 'allow' }))

// Middleware to validate allowed IP
function ipValidator(req, res, next) {
  console.log('ipValidator =>', req.headers);

  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress;

  console.log(`Request IP: ${ip}`);

  // Define your allowed IP here (adjust as needed)
  const allowedIP = '2401:4900:8841:fa80:419c:e43f:75b2:7f2a';
  const allowedIP2 = "192.168.1.28";
  const allowedIP3 = "106.219.155.126";

  // Check direct or IPv6-compatible version
  if (ip === allowedIP || ip === `::ffff:${allowedIP}` || ip === allowedIP2 || ip === `::ffff:${allowedIP2}` || ip === allowedIP3 || ip === `::ffff:${allowedIP3}`) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: IP not allowed', ip: ip });
  }
}

// Apply IP validation middleware
// app.use(ipValidator);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the allowed IP!', ip: req.ip });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
