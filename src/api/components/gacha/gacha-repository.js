const { GachaAttempts, Prizes } = require('../../../models');

/**
 * Get the number of gacha attempts by a user today
 */
async function getAttemptsCountToday(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return GachaAttempts.countDocuments({
    userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

/**
 * Create a gacha attempt record
 */
async function createAttempt(userId, prize) {
  return GachaAttempts.create({ userId, prize });
}

/**
 * Get gacha history for a user
 */
async function getAttemptsByUserId(userId) {
  return GachaAttempts.find({ userId }).sort({ createdAt: -1 });
}

/**
 * Get a prize by name
 */
async function getPrizeByName(name) {
  return Prizes.findOne({ name });
}

/**
 * Get all prizes
 */
async function getAllPrizes() {
  return Prizes.find({});
}

/**
 * Increment the winner count for a prize
 */
async function incrementPrizeWinners(name) {
  return Prizes.findOneAndUpdate(
    { name, $expr: { $lt: ['$currentWinners', '$maxWinners'] } },
    { $inc: { currentWinners: 1 } },
    { new: true }
  );
}

/**
 * Initialize default prizes if they don't exist
 */
async function initializePrizes() {
  const defaultPrizes = [
    { name: 'Emas 10 gram', maxWinners: 1 },
    { name: 'Smartphone X', maxWinners: 5 },
    { name: 'Smartwatch Y', maxWinners: 10 },
    { name: 'Voucher Rp100.000', maxWinners: 100 },
    { name: 'Pulsa Rp50.000', maxWinners: 500 },
  ];

  const existingCount = await Prizes.countDocuments({});
  if (existingCount === 0) {
    await Prizes.insertMany(defaultPrizes);
  }
}

/**
 * Get all winning attempts (with prize not null)
 */
async function getAllWinners() {
  return GachaAttempts.find({ prize: { $ne: null } }).sort({ createdAt: -1 });
}

module.exports = {
  getAttemptsCountToday,
  createAttempt,
  getAttemptsByUserId,
  getPrizeByName,
  getAllPrizes,
  incrementPrizeWinners,
  initializePrizes,
  getAllWinners,
};
