const express = require('express');

const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  // Draw gacha (POST) - main endpoint
  route.post('/draw', gachaController.drawGacha);

  // Get gacha history for a user (GET) - bonus 1
  route.get('/history', gachaController.getHistory);

  // Get prize list with remaining quotas (GET) - bonus 2
  route.get('/prizes', gachaController.getPrizes);

  // Get winners list with masked names (GET) - bonus 3
  route.get('/winners', gachaController.getWinners);
};
