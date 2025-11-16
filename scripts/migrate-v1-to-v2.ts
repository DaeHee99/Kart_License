/**
 * V1 to V2 Database Migration Script
 *
 * This script migrates data from v1 schema to v2 schema
 * Run with: npx ts-node scripts/migrate-v1-to-v2.ts
 *
 * IMPORTANT:
 * - Backup your database before running this script
 * - Set MONGODB_URI environment variable
 * - Run in a safe environment first
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Profile image mapping
const ProfileImageMap: Record<string, string> = {
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_dao.png?alt=media&token=4d8e01e4-8d52-441f-a73b-b43aaea9b1bc': '/profile/gyool_dao.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_dao.png?alt=media&token=07110f66-9806-4e10-aa84-2b3e83c9d450': '/profile/jakong_dao.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_dizini.png?alt=media&token=52ea802f-6434-4f9f-a03f-3de86c21a308': '/profile/gyool_dizini.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_dizini.png?alt=media&token=9ee023f2-22be-434d-ac2a-6072c03dd7d9': '/profile/jakong_dizini.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_bazzi.png?alt=media&token=1f427adf-ae22-4f05-b704-821a46b6b37a': '/profile/gyool_bazzi.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_bazzi.png?alt=media&token=a2f49070-931b-4def-a196-7ae5e442fd3b': '/profile/jakong_bazzi.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_marid.png?alt=media&token=fb2dd66c-e573-44f1-b4fd-f88babc6143c': '/profile/gyool_marid.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_marid.png?alt=media&token=a6b5a54f-088e-4153-a682-cfaa13e2f853': '/profile/jakong_marid.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_eddi.png?alt=media&token=40398f31-5b97-4fb4-a35a-d3c7d079f307': '/profile/gyool_eddi.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_eddi.png?alt=media&token=e4a324b4-dc21-4588-8617-193183304437': '/profile/jakong_eddi.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_uni.png?alt=media&token=4bdd693c-9c66-43e5-aba5-d821a7ddd22e': '/profile/gyool_uni.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_uni.png?alt=media&token=5c5c5d67-82ab-41d1-8e25-c7b4d2572f09': '/profile/jakong_uni.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_kepi.png?alt=media&token=26860945-3bd0-4735-9241-ad6fdcd493b1': '/profile/gyool_kepi.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_keppi.png?alt=media&token=61d6e072-ff9e-49b8-bb2b-4d55fdba148a': '/profile/jakong_keppi.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fgyool%2Fgyool_rodumani.png?alt=media&token=2c59f00a-e142-4b53-bc39-19c316917b7f': '/profile/gyool_rodumani.png',
  'https://firebasestorage.googleapis.com/v0/b/kart-chu-club.appspot.com/o/licenseImages%2Fjakong%2Fjakong_rodumani.png?alt=media&token=9cd7a121-9842-4fdf-a65c-0bfd02c00d46': '/profile/jakong_rodumani.png',
};

// Tier mapping
const TierIndexToName: Record<number, string> = {
  0: 'elite',
  1: 'master',
  2: 'diamond',
  3: 'platinum',
  4: 'gold',
  5: 'silver',
  6: 'bronze',
  7: 'bronze',
};

interface MigrationStats {
  users: { total: number; migrated: number; errors: number };
  announcements: { total: number; migrated: number; errors: number };
  feedbacks: { total: number; migrated: number; errors: number };
  logs: { total: number; migrated: number; errors: number };
  records: { total: number; migrated: number; errors: number };
}

async function connectDB() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to MongoDB');
}

async function migrateUsers(stats: MigrationStats) {
  console.log('\n=== Migrating Users ===');
  const db = mongoose.connection.db;
  const usersCollection = db!.collection('users');

  const users = await usersCollection.find({}).toArray();
  stats.users.total = users.length;

  for (const user of users) {
    try {
      const oldImage = user.image;
      let newImage = oldImage || '';

      // Convert Firebase URL to local path
      if (oldImage && ProfileImageMap[oldImage]) {
        newImage = ProfileImageMap[oldImage];
      } else if (oldImage && oldImage.startsWith('https://firebasestorage')) {
        // If not in map but is a Firebase URL, keep as is or set default
        console.log(`Warning: Unknown image URL for user ${user._id}: ${oldImage}`);
        newImage = '/profile/gyool_dizini.png'; // Default
      }

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { image: newImage } }
      );

      stats.users.migrated++;
      console.log(`User ${user.name} migrated (image: ${oldImage?.substring(0, 50)}... → ${newImage})`);
    } catch (error) {
      stats.users.errors++;
      console.error(`Error migrating user ${user._id}:`, error);
    }
  }
}

async function migrateAnnouncements(stats: MigrationStats) {
  console.log('\n=== Migrating Announcements (Notice → Announcement) ===');
  const db = mongoose.connection.db;

  // Check if notices collection exists
  const collections = await db!.listCollections({ name: 'notices' }).toArray();
  if (collections.length === 0) {
    console.log('No notices collection found. Skipping.');
    return;
  }

  const noticesCollection = db!.collection('notices');
  const announcementsCollection = db!.collection('announcements');

  const notices = await noticesCollection.find({}).toArray();
  stats.announcements.total = notices.length;

  for (const notice of notices) {
    try {
      const newAnnouncement = {
        _id: notice._id,
        user: notice.user,
        title: '', // Add empty title
        content: notice.content,
        show: false, // Set all to false
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt,
      };

      await announcementsCollection.insertOne(newAnnouncement);
      stats.announcements.migrated++;
      console.log(`Notice ${notice._id} migrated to Announcement`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.log(`Announcement ${notice._id} already exists, skipping`);
        stats.announcements.migrated++;
      } else {
        stats.announcements.errors++;
        console.error(`Error migrating notice ${notice._id}:`, error);
      }
    }
  }
}

async function migrateFeedbacks(stats: MigrationStats) {
  console.log('\n=== Migrating Feedbacks (Survey → Feedback) ===');
  const db = mongoose.connection.db;

  // Check if surveys collection exists
  const collections = await db!.listCollections({ name: 'surveys' }).toArray();
  if (collections.length === 0) {
    console.log('No surveys collection found. Skipping.');
    return;
  }

  const surveysCollection = db!.collection('surveys');
  const feedbacksCollection = db!.collection('feedbacks');

  const surveys = await surveysCollection.find({}).toArray();
  stats.feedbacks.total = surveys.length;

  for (const survey of surveys) {
    try {
      const newFeedback = {
        _id: survey._id,
        user: survey.user,
        license: survey.license,
        level: survey.level,
        balance: survey.balance,
        review: survey.review || '',
        season: survey.season,
        recordId: survey.recordId,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
      };

      await feedbacksCollection.insertOne(newFeedback);
      stats.feedbacks.migrated++;
      console.log(`Survey ${survey._id} migrated to Feedback`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.log(`Feedback ${survey._id} already exists, skipping`);
        stats.feedbacks.migrated++;
      } else {
        stats.feedbacks.errors++;
        console.error(`Error migrating survey ${survey._id}:`, error);
      }
    }
  }
}

async function migrateLogs(stats: MigrationStats, userMap: Map<string, { nickname: string; profilePicture: string }>) {
  console.log('\n=== Migrating Logs ===');
  const db = mongoose.connection.db;
  const logsCollection = db!.collection('logs');

  const logs = await logsCollection.find({}).toArray();
  stats.logs.total = logs.length;

  for (const log of logs) {
    try {
      // Get user info from userMap
      let nickname = '비로그인 유저';
      let profilePicture = '/profile/gyool_dizini.png';

      if (log.user) {
        const userInfo = userMap.get(log.user.toString());
        if (userInfo) {
          nickname = userInfo.nickname;
          profilePicture = userInfo.profilePicture;
        }
      }

      await logsCollection.updateOne(
        { _id: log._id },
        {
          $set: {
            nickname: nickname,
            profilePicture: profilePicture,
            actionType: '', // Empty string for legacy logs
            metadata: {
              ip: '',
              userAgent: '',
            },
          },
        }
      );

      stats.logs.migrated++;
      console.log(`Log ${log._id} migrated`);
    } catch (error) {
      stats.logs.errors++;
      console.error(`Error migrating log ${log._id}:`, error);
    }
  }
}

async function migrateRecords(stats: MigrationStats) {
  console.log('\n=== Migrating Records ===');
  const db = mongoose.connection.db;
  const recordsCollection = db!.collection('records');

  const records = await recordsCollection.find({}).toArray();
  stats.records.total = records.length;

  for (const record of records) {
    try {
      // Skip if already migrated (has records array instead of record)
      if (record.records && Array.isArray(record.records) && record.records.length > 0 && record.records[0].tier) {
        console.log(`Record ${record._id} already migrated, skipping`);
        stats.records.migrated++;
        continue;
      }

      // Convert recordCount to tierDistribution
      const recordCount = record.recordCount || [];
      const tierDistribution = {
        elite: recordCount[0] || 0,
        master: recordCount[1] || 0,
        diamond: recordCount[2] || 0,
        platinum: recordCount[3] || 0,
        gold: recordCount[4] || 0,
        silver: recordCount[5] || 0,
        bronze: (recordCount[6] || 0) + (recordCount[7] || 0), // Combine 6 and 7
      };

      // Convert license to finalTier
      const finalTier = record.license || '일반';

      // Convert record array to records array with difficulty
      const mapCount = record.mapCount || { Rookie: 0, L3: 0, L2: 0, L1: 0 };
      const oldRecords = record.record || [];

      const newRecords = [];
      let currentIndex = 0;

      for (const oldRec of oldRecords) {
        // Determine difficulty based on position
        let difficulty = 'L1';
        if (currentIndex < mapCount.Rookie) {
          difficulty = '루키';
        } else if (currentIndex < mapCount.Rookie + mapCount.L3) {
          difficulty = 'L3';
        } else if (currentIndex < mapCount.Rookie + mapCount.L3 + mapCount.L2) {
          difficulty = 'L2';
        } else {
          difficulty = 'L1';
        }

        // Convert select index to tier string
        const tierIndex = oldRec.select;
        const tier = TierIndexToName[tierIndex] || 'bronze';

        newRecords.push({
          mapName: oldRec.mapName || '',
          difficulty: difficulty,
          record: '', // Empty string for legacy records
          tier: tier,
        });

        currentIndex++;
      }

      await recordsCollection.updateOne(
        { _id: record._id },
        {
          $set: {
            tierDistribution: tierDistribution,
            finalTier: finalTier,
            records: newRecords,
          },
          $unset: {
            recordCount: '',
            mapCount: '',
            license: '',
            record: '',
          },
        }
      );

      stats.records.migrated++;
      console.log(`Record ${record._id} migrated (${newRecords.length} maps)`);
    } catch (error) {
      stats.records.errors++;
      console.error(`Error migrating record ${record._id}:`, error);
    }
  }
}

async function buildUserMap(): Promise<Map<string, { nickname: string; profilePicture: string }>> {
  console.log('\n=== Building User Map ===');
  const db = mongoose.connection.db;
  const usersCollection = db!.collection('users');

  const users = await usersCollection.find({}).toArray();
  const userMap = new Map<string, { nickname: string; profilePicture: string }>();

  for (const user of users) {
    let profilePicture = user.image || '/profile/gyool_dizini.png';

    // If still Firebase URL, use default
    if (profilePicture.startsWith('https://firebasestorage')) {
      profilePicture = ProfileImageMap[profilePicture] || '/profile/gyool_dizini.png';
    }

    userMap.set(user._id.toString(), {
      nickname: user.name || '알 수 없음',
      profilePicture: profilePicture,
    });
  }

  console.log(`Built user map with ${userMap.size} users`);
  return userMap;
}

async function main() {
  const stats: MigrationStats = {
    users: { total: 0, migrated: 0, errors: 0 },
    announcements: { total: 0, migrated: 0, errors: 0 },
    feedbacks: { total: 0, migrated: 0, errors: 0 },
    logs: { total: 0, migrated: 0, errors: 0 },
    records: { total: 0, migrated: 0, errors: 0 },
  };

  try {
    await connectDB();

    console.log('\n========================================');
    console.log('Starting V1 to V2 Migration');
    console.log('========================================');

    // Step 1: Migrate Users first (needed for Log migration)
    await migrateUsers(stats);

    // Step 2: Build user map after user migration
    const userMap = await buildUserMap();

    // Step 3: Migrate other collections
    await migrateAnnouncements(stats);
    await migrateFeedbacks(stats);
    await migrateLogs(stats, userMap);
    await migrateRecords(stats);

    console.log('\n========================================');
    console.log('Migration Complete!');
    console.log('========================================');
    console.log('\nMigration Statistics:');
    console.log(`Users: ${stats.users.migrated}/${stats.users.total} (${stats.users.errors} errors)`);
    console.log(`Announcements: ${stats.announcements.migrated}/${stats.announcements.total} (${stats.announcements.errors} errors)`);
    console.log(`Feedbacks: ${stats.feedbacks.migrated}/${stats.feedbacks.total} (${stats.feedbacks.errors} errors)`);
    console.log(`Logs: ${stats.logs.migrated}/${stats.logs.total} (${stats.logs.errors} errors)`);
    console.log(`Records: ${stats.records.migrated}/${stats.records.total} (${stats.records.errors} errors)`);

    if (stats.users.errors + stats.announcements.errors + stats.feedbacks.errors + stats.logs.errors + stats.records.errors > 0) {
      console.log('\nWarning: Some migrations had errors. Please check the logs above.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

main();
