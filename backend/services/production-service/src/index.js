const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'production-service' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Production Service running on port ${PORT}`);
});
