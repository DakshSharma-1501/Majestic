import { myDataSource } from "./data-source";

export async function initializeDatabase() {
  try {
    if (!myDataSource.isInitialized) {
      await myDataSource.initialize();
      console.log("✅ Data Source has been initialized!");
    }
    return { success: true };
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

export async function syncDatabase() {
  try {
    await initializeDatabase();
    
    // TypeORM will automatically sync your entities to Supabase
    // because synchronize: true is set in data-source.ts
    await myDataSource.synchronize();
    console.log("✅ Database synced successfully!");
    
    return {
      success: true,
      entities: myDataSource.entityMetadatas.map(entity => entity.tableName)
    };
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    throw error;
  }
}


