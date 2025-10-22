const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'recipe-service' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Recipe Service running on port ${PORT}`);
});
