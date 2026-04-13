const express = require('express');

const gacha = require('./components/gacha/gacha-route');

module.exports = () => {
  const app = express.Router();

  gacha(app);

  return app;
};
