const express = require('express');
const app = express();
app.get('*all', (req, res) => {
  res.json({ all: req.params.all });
});
app.listen(3002, () => {
  fetch('http://localhost:3002/some/random/path')
    .then(r => r.json())
    .then(console.log)
    .then(() => process.exit(0));
});
