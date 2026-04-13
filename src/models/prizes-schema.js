module.exports = (db) =>
  db.model(
    'Prizes',
    db.Schema({
      name: {
        type: String,
        required: true,
        unique: true,
      },
      maxWinners: {
        type: Number,
        required: true,
      },
      currentWinners: {
        type: Number,
        default: 0,
      },
    })
  );
