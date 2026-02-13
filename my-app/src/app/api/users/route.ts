import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Example: Get all users
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      users: users || [],
      count: users?.length || 0,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}

// Example: Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, passwordHash, fullName, phone, avatarUrl } = body;

    // Validate required fields
    if (!email || !passwordHash || !fullName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, passwordHash, fullName",
        },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          passwordHash,
          fullName,
          phone: phone || null,
          avatarUrl: avatarUrl || null,
          isActive: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create user",
      },
      { status: 500 },
    );
  }
}
