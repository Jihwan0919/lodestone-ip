import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  let ip = forwarded ? forwarded.split(",").at(0)?.trim() || "" : realIp || "";

  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    const services = [
      "https://icanhazip.com",
      "https://ifconfig.me",
      "https://ident.me",
    ];
    for (const url of services) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          ip = (await res.text()).trim();
          if (ip) break;
        }
      } catch {}
    }
  }

  return NextResponse.json({ ip: ip || "IP 확인 불가" });
}
