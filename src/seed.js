const mongoose = require('mongoose');
const models = require('./models');

const Prize = models.Prize;

async function seed() {
  await Prize.deleteMany();

  await Prize.insertMany([
    { name: 'Emas 10 gram', quota: 1 },
    { name: 'Smartphone X', quota: 5 },
    { name: 'Smartwatch Y', quota: 10 },
    { name: 'Voucher Rp100.000', quota: 100 },
    { name: 'Pulsa Rp50.000', quota: 500 },
  ]);

  console.log('Seed success');
  process.exit();
}

seed();
