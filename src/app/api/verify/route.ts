import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let step = "시작";
  try {
    const { nickname, ip } = await request.json();
    const cleanName = (nickname || "").trim();
    if (!cleanName) {
      return NextResponse.json({ error: "마인크래프트 닉네임을 입력해 주세요." }, { status: 400 });
    }

    step = "Mojang 조회";
    const mojangRes = await fetch(
      `https://minecraftservices.com{encodeURIComponent(cleanName)}`,
      { cache: "no-store" }
    );

    if (mojangRes.status === 404 || mojangRes.status === 204) {
      return NextResponse.json(
        { error: "Mojang에 등록되지 않은 비정품(또는 잘못된) 닉네임입니다." },
        { status: 404 }
      );
    }

    const data = await mojangRes.json();
    const realNickname: string = data.name;
    const uuid: string = data.id;

    step = "디스코드 전송";
    const rawWebhook = process.env.DISCORD_WEBHOOK_URL || "";
    const webhookUrl = rawWebhook.replace(/[\s\uFEFF]/g, "");

    if (!webhookUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: `웹후크 URL 설정 안됨 (현재값 길이: ${webhookUrl.length})` },
        { status: 500 }
      );
    }

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "MC 정품스캐너",
        embeds: [
          {
            title: "✅ 신규 정품 및 IP 인증 완료",
            color: 0x00a651,
            fields: [
              { name: "마인크래프트 닉네임", value: `\`${realNickname}\``, inline: true },
              { name: "승인 요청 IP", value: `\`${ip || "확인 불가"}\``, inline: true },
              { name: "UUID", value: `\`${uuid}\``, inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!discordRes.ok) {
      const txt = await discordRes.text();
      return NextResponse.json(
        { error: `디스코드 거부 (${discordRes.status}): ${txt}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ nickname: realNickname, uuid, ip });
  } catch (err: unknown) {
    const e = err as { message?: string; cause?: { code?: string; message?: string } };
    const detail = e?.cause?.code || e?.cause?.message || e?.message || "알 수 없음";
    return NextResponse.json(
      { error: `[${step} 단계 실패] ${detail}` },
      { status: 500 }
    );
  }
}
