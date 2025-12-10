const { seedDefaultAgent } = require('../libs/seed.ts');

seedDefaultAgent().then(() => {
  console.log('Seed completed');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
