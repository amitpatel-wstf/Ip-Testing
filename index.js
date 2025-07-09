const express = require('express');
const app = express();
const PORT = 3000;

// Enable proxy trust if behind something like Nginx
app.set('trust proxy', true);

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
  const allowedIP2 = "192.168.1.28"

  // Check direct or IPv6-compatible version
  if (ip === allowedIP || ip === `::ffff:${allowedIP}` || ip === allowedIP2 || ip === `::ffff:${allowedIP2}`) {
    next();
  } else {
    res.status(403).send('Forbidden: IP not allowed');
  }
}

// Apply IP validation middleware
app.use(ipValidator);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the allowed IP!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
