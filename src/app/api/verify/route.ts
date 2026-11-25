import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nickname, ip } = await request.json();

    if (!nickname || typeof nickname !== "string") {
      return NextResponse.json({ error: "마인크래프트 닉네임을 입력해 주세요." }, { status: 400 });
    }

    const cleanName = nickname.trim();

    // 서버에서 mc-heads API로 정품 계정 및 UUID 조회 (CORS 및 Mojang 차단 우회)
    const mcRes = await fetch(`https://mc-heads.net{encodeURIComponent(cleanName)}`, {
      cache: "no-store",
    });

    if (!mcRes.ok) {
      return NextResponse.json(
        { error: "Mojang에 등록되지 않은 비정품(또는 잘못된) 닉네임입니다." },
        { status: 404 }
      );
    }

    const mcJson = await mcRes.json();
    const realNickname: string = mcJson.name;
    const uuid: string = mcJson.id;

    // 디스코드 웹후크 전송
    const rawWebhook = process.env.DISCORD_WEBHOOK_URL || "";
    const webhookUrl = rawWebhook.replace(/^\uFEFF/, "").trim();

    if (webhookUrl && webhookUrl.startsWith("https://")) {
      const discordRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "MC 정품스캐너",
          avatar_url: `https://mc-heads.net{uuid}/100`,
          embeds: [
            {
              title: "✅ 신규 정품 및 IP 인증 완료",
              color: 0x00a651,
              thumbnail: { url: `https://mc-heads.net{uuid}/100` },
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
        return NextResponse.json(
          { error: `디스코드 전송 오류 (${discordRes.status})` },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ nickname: realNickname, uuid, ip });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: `서버 오류: ${msg}` }, { status: 500 });
  }
}
