module.exports = (db) =>
  db.model(
    'GachaAttempts',
    db.Schema({
      userId: {
        type: String,
        required: true,
      },
      prize: {
        type: String,
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })
  );
