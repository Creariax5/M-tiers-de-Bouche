const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'label-service' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Label Service running on port ${PORT}`);
});
