module.exports = (app) => {
  const models = require('../../../models');
  const { maskName } = require('../../../utils/maskName');

  const Attempt = models.Attempts;
  const Prize = models.Prize;
  const GachaLog = models.GachaLog;

  // POST /gacha
  app.post('/gacha', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'userId is required',
      });
    }

    const today = new Date().toLocaleDateString('en-CA');

    let attempt = await Attempt.findOne({ userId, date: today });

    if (!attempt) {
      attempt = new Attempt({ userId, date: today, count: 0 });
    }

    if (attempt.count >= 5) {
      return res.status(400).json({
        message: 'Daily limit reached (max 5 gacha per day)',
      });
    }

    attempt.count += 1;
    await attempt.save();

    const win = Math.random() < 0.3;
    let prizeWon = null;

    if (win) {
      const allPrizes = await Prize.find();
      const prizes = allPrizes.filter((p) => p.quota > 0);

      if (prizes.length > 0) {
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];

        randomPrize.quota -= 1;
        await randomPrize.save();

        prizeWon = randomPrize.name;
      }
    }

    await GachaLog.create({
      userId,
      prize: prizeWon,
    });

    if (prizeWon) {
      return res.json({
        message: `Congratulations! You won!`,
        prize: prizeWon,
      });
    }

    return res.json({
      message: "Don't be sad and try again:)",
    });
  });

  // history gacha - bonus 1
  app.get('/gacha/history/:userId', async (req, res) => {
    const logs = await GachaLog.find({ userId: req.params.userId });

    res.json(logs);
  });

  // remaining prizes - bonus 2
  app.get('/prizes', async (req, res) => {
    const prizes = await Prize.find();

    res.json(prizes);
  });

  // winner's name (masked) - bonus 3
  app.get('/winners', async (req, res) => {
    const allLogs = await GachaLog.find();
    const logs = allLogs.filter((log) => log.prize !== null);

    const result = logs.map((log) => ({
      user: maskName(log.userId),
      prize: log.prize,
    }));

    res.json(result);
  });
};
