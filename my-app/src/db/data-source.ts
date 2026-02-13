import { createClient } from "@supabase/supabase-js";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User, Payment } from "./entities";

config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db.hdjnqxigiyfpesftbfsl.supabase.co",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "postgres",
  entities: [User, Payment],
  logging: true,
  synchronize: true,
});

export { supabase };
