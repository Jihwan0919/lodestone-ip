import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cleanName = String(body.nickname || "").trim();
    const ip = String(body.ip || "확인 불가");

    if (!cleanName) {
      return NextResponse.json({ error: "닉네임을 입력하세요." }, { status: 400 });
    }

    // 1. Mojang 공식 API 조회
    const res = await fetch(
      `https://minecraftservices.com{encodeURIComponent(cleanName)}`
    );

    if (res.status === 404 || res.status === 204) {
      return NextResponse.json({ error: "존재하지 않는 비정품 닉네임입니다." }, { status: 404 });
    }

    const mc = await res.json();
    const realName = mc.name;
    const uuid = mc.id;

    // 2. 디스코드 전송
    const webhook = (process.env.DISCORD_WEBHOOK_URL || "").trim();
    if (!webhook) {
      return NextResponse.json({ error: "Vercel에 DISCORD_WEBHOOK_URL이 설정되지 않았습니다." }, { status: 500 });
    }

    const dRes = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "MC 정품스캐너",
        embeds: [{
          title: "✅ 신규 정품 및 IP 인증 완료",
          color: 5763719,
          fields: [
            { name: "마인크래프트 닉네임", value: realName, inline: true },
            { name: "승인 요청 IP", value: ip, inline: true },
            { name: "UUID", value: uuid, inline: false }
          ]
        }]
      })
    });

    if (!dRes.ok) {
      return NextResponse.json({ error: `디스코드 오류 코드: ${dRes.status}` }, { status: 502 });
    }

    return NextResponse.json({ nickname: realName, uuid, ip });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: `상세에러: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    );
  }
}
