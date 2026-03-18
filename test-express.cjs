const express = require('express');
const app = express();
app.get('/api/proxy/coingecko/*path', (req, res) => {
  res.json({ path: req.params.path });
});
app.listen(3001, () => {
  fetch('http://localhost:3001/api/proxy/coingecko/simple/price')
    .then(r => r.json())
    .then(console.log)
    .then(() => process.exit(0));
});
