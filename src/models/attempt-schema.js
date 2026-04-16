module.exports = (db) =>
  db.model(
    'Attempts',
    db.Schema({
      userId: String,
      date: String,
      count: { type: Number, default: 0 },
    })
  );
