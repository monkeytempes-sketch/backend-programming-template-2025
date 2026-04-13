const gachaRepository = require('./gacha-repository');

const MAX_ATTEMPTS_PER_DAY = 5;

/**
 * Perform a gacha draw for a user
 */
async function drawGacha(userId) {
  // Check daily attempt limit
  const attemptsToday = await gachaRepository.getAttemptsCountToday(userId);
  if (attemptsToday >= MAX_ATTEMPTS_PER_DAY) {
    return {
      success: false,
      error: 'DAILY_LIMIT_EXCEEDED',
      message: `Anda sudah mencapai batas maksimal ${MAX_ATTEMPTS_PER_DAY} kali gacha hari ini.`,
    };
  }

  // Initialize prizes if needed
  await gachaRepository.initializePrizes();

  // Get all available prizes and their remaining quotas
  const prizes = await gachaRepository.getAllPrizes();
  const availablePrizes = prizes.filter((p) => p.currentWinners < p.maxWinners);

  // Calculate total available prize slots
  const totalAvailableSlots = availablePrizes.reduce(
    (sum, p) => sum + (p.maxWinners - p.currentWinners),
    0
  );

  // Determine if the user wins a prize
  // Probability: use a weighted random based on remaining quotas
  // Add a "no prize" weight to make it harder to win
  const noPrizeWeight = Math.max(totalAvailableSlots * 2, 100);
  const totalWeight = totalAvailableSlots + noPrizeWeight;

  const roll = Math.random() * totalWeight;

  let wonPrize = null;

  if (roll < totalAvailableSlots && availablePrizes.length > 0) {
    // User potentially wins - determine which prize
    let cumulative = 0;
    let selectedPrizeName = null;
    for (let i = 0; i < availablePrizes.length; i += 1) {
      const remaining =
        availablePrizes[i].maxWinners - availablePrizes[i].currentWinners;
      cumulative += remaining;
      if (roll < cumulative) {
        selectedPrizeName = availablePrizes[i].name;
        break;
      }
    }

    if (selectedPrizeName) {
      // Try to claim this prize (atomic operation to prevent race conditions)
      // eslint-disable-next-line no-await-in-loop
      const updated =
        await gachaRepository.incrementPrizeWinners(selectedPrizeName);
      if (updated) {
        wonPrize = selectedPrizeName;
      }
    }
  }

  // Record the attempt
  const attempt = await gachaRepository.createAttempt(userId, wonPrize);

  if (wonPrize) {
    return {
      success: true,
      message: `Selamat! Anda memenangkan: ${wonPrize}`,
      prize: wonPrize,
      attemptId: attempt.id,
    };
  }

  return {
    success: true,
    message: 'Maaf, Anda tidak memenangkan hadiah kali ini. Coba lagi!',
    prize: null,
    attemptId: attempt.id,
  };
}

/**
 * Get gacha history for a user
 */
async function getHistory(userId) {
  const attempts = await gachaRepository.getAttemptsByUserId(userId);
  return attempts.map((a) => ({
    attemptId: a.id,
    prize: a.prize,
    createdAt: a.createdAt,
  }));
}

/**
 * Get all prizes with remaining quotas
 */
async function getPrizesWithQuota() {
  await gachaRepository.initializePrizes();
  const prizes = await gachaRepository.getAllPrizes();
  return prizes.map((p) => ({
    name: p.name,
    maxWinners: p.maxWinners,
    currentWinners: p.currentWinners,
    remainingQuota: p.maxWinners - p.currentWinners,
  }));
}

/**
 * Mask a name randomly
 * e.g., "Jane Doe" -> "J*** *oe" or similar
 */
function maskName(name) {
  if (!name) return '***';
  return name
    .split('')
    .map((char) => {
      if (char === ' ') return ' ';
      // Randomly mask ~50% of characters
      return Math.random() < 0.5 ? '*' : char;
    })
    .join('');
}

/**
 * Get winners list grouped by prize with masked names
 */
async function getWinners() {
  await gachaRepository.initializePrizes();
  const winners = await gachaRepository.getAllWinners();

  // Group winners by prize
  const grouped = {};
  winners.forEach((w) => {
    if (!grouped[w.prize]) {
      grouped[w.prize] = [];
    }
    grouped[w.prize].push({
      userId: maskName(w.userId),
      wonAt: w.createdAt,
    });
  });

  return grouped;
}

module.exports = {
  drawGacha,
  getHistory,
  getPrizesWithQuota,
  getWinners,
};
