/**
 * Migration Script: Add likes field to existing posts and comments
 *
 * Run with: npx ts-node -r dotenv/config scripts/migrate-add-likes.ts
 */

import mongoose from "mongoose";
import Post from "../src/lib/db/models/post.model";
import Comment from "../src/lib/db/models/comment.model";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    // Add likes field to posts that don't have it
    console.log("\n1. Migrating Posts...");
    const postsResult = await Post.updateMany(
      { likes: { $exists: false } },
      { $set: { likes: [] } }
    );
    console.log(`✓ Updated ${postsResult.modifiedCount} posts`);

    // Add likes field to comments that don't have it
    console.log("\n2. Migrating Comments...");
    const commentsResult = await Comment.updateMany(
      { likes: { $exists: false } },
      { $set: { likes: [] } }
    );
    console.log(`✓ Updated ${commentsResult.modifiedCount} comments`);

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
}

migrate();
