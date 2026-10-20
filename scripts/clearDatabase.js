const mongoose = require('../backend/node_modules/mongoose');
const env = require('../backend/src/config/env');

async function clearAllData() {
  try {
    console.log('[CLEAR] Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('[CLEAR] Connected to MongoDB.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`[CLEAR] Found ${collections.length} collections. Clearing all...`);

    for (const c of collections) {
      await mongoose.connection.db.collection(c.name).deleteMany({});
      console.log(`[CLEAR] Cleared collection: ${c.name}`);
    }

    console.log('\n[CLEAR] Database is now completely clean and empty.');
    process.exit(0);
  } catch (error) {
    console.error('[CLEAR] Error clearing database:', error.message);
    process.exit(1);
  }
}

clearAllData();
