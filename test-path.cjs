const { match } = require("path-to-regexp");
const m = match("/api/proxy/coingecko/*path");
console.log(m("/api/proxy/coingecko/simple/price"));
