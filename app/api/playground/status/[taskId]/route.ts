import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";

function generateKlingJWT(): string {
  const ak = process.env.KLING_ACCESS_KEY_ID ?? "";
  const sk = process.env.KLING_ACCESS_KEY_SECRET ?? "";
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ iss: ak, exp: now + 1800, nbf: now - 5 })
  ).toString("base64url");
  const sig = createHmac("sha256", sk).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  if (!taskId || !/^[a-zA-Z0-9_-]+$/.test(taskId)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  if (!process.env.KLING_ACCESS_KEY_ID || !process.env.KLING_ACCESS_KEY_SECRET) {
    return NextResponse.json({ error: "Kling API not configured" }, { status: 503 });
  }

  try {
    const token = generateKlingJWT();
    const poll = await fetch(`https://api.klingai.com/v1/videos/text2video/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!poll.ok) {
      return NextResponse.json(
        { status: "failed", error: `Kling API error ${poll.status}` },
        { status: 500 }
      );
    }

    const data = await poll.json() as {
      data?: {
        task_status?: string;
        task_result?: { videos?: { url?: string }[] };
      };
    };

    const taskStatus = data.data?.task_status;

    if (taskStatus === "succeed") {
      const videoUrl = data.data?.task_result?.videos?.[0]?.url;
      if (videoUrl) {
        return NextResponse.json({ status: "completed", videoUrl });
      }
      return NextResponse.json({ status: "failed", error: "No video URL in response" });
    }

    if (taskStatus === "failed") {
      return NextResponse.json({ status: "failed", error: "Kling video generation failed" });
    }

    return NextResponse.json({ status: "pending" });
  } catch (e) {
    console.error("Kling status check error:", e);
    return NextResponse.json({ status: "error", error: (e as Error).message }, { status: 500 });
  }
}
