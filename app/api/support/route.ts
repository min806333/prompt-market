import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 1시간에 3회 (스팸 방지)
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 3, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": "3600" },
      }
    );
  }

  try {
    const body = await req.json();
    const { name, email, category, message } = body;

    if (!name || !email || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof name !== "string" || typeof email !== "string" ||
        typeof category !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
    }

    if (message.length > 5000 || name.length > 100 || email.length > 200) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("support_tickets").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      message: message.trim(),
    });

    if (error) {
      console.error("Support ticket insert error:", error);
      return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Support API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
