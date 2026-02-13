import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      message: "❌ Environment variables not set",
      env: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: "✅ Supabase environment variables are configured correctly!",
    config: {
      url: supabaseUrl,
      keyLength: supabaseKey.length,
      keyPrefix: supabaseKey.substring(0, 20) + "...",
    },
  });
}
