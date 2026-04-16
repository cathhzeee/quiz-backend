module.exports = (db) =>
  db.model(
    'GachaLog',
    db.Schema({
      userId: String,
      prize: { type: String, default: null },
      createdAt: { type: Date, default: Date.now },
    })
  );
