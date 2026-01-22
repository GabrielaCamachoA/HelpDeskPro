import { seedDefaultAgent } from '../libs/seed.js';

seedDefaultAgent().then(() => {
  console.log('Seed completed');
  process.exit(0);
}).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
