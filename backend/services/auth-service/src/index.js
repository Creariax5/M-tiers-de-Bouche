const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Auth Service running on port ${PORT}`);
});
