const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle gacha draw request
 */
async function drawGacha(request, response, next) {
  try {
    const { userId } = request.body;

    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION, 'userId is required');
    }

    const result = await gachaService.drawGacha(userId);

    if (result.error === 'DAILY_LIMIT_EXCEEDED') {
      throw errorResponder(errorTypes.FORBIDDEN, result.message);
    }

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get gacha history request
 */
async function getHistory(request, response, next) {
  try {
    const { userId } = request.query;

    if (!userId) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'userId query parameter is required'
      );
    }

    const history = await gachaService.getHistory(userId);

    return response.status(200).json({
      userId,
      totalAttempts: history.length,
      history,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get prizes with remaining quota
 */
async function getPrizes(request, response, next) {
  try {
    const prizes = await gachaService.getPrizesWithQuota();

    return response.status(200).json({ prizes });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get winners list with masked names
 */
async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinners();

    return response.status(200).json({ winners });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  drawGacha,
  getHistory,
  getPrizes,
  getWinners,
};
