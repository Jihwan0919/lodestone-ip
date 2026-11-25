import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nickname, ip } = await request.json();

    if (!nickname || typeof nickname !== "string") {
      return NextResponse.json({ error: "마인크래프트 닉네임을 입력해 주세요." }, { status: 400 });
    }

    const cleanName = nickname.trim();
    let realNickname = "";
    let uuid = "";

    // 1순위: Mojang 공식 프로필 API (Vercel 서버에서 100% 작동)
    try {
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
      if (mojangRes.ok) {
        const data = await mojangRes.json();
        realNickname = data.name;
        uuid = data.id;
      }
    } catch {}

    // 2순위 백업: PlayerDB API
    if (!uuid) {
      try {
        const pdbRes = await fetch(
          `https://playerdb.co{encodeURIComponent(cleanName)}`,
          { headers: { "User-Agent": "MC-Verify-App" }, cache: "no-store" }
        );
        const pdbJson = await pdbRes.json();
        if (pdbRes.ok && pdbJson.success && pdbJson.data?.player) {
          realNickname = pdbJson.data.player.username;
          uuid = pdbJson.data.player.raw_id;
        } else if (pdbRes.status === 400 || pdbRes.status === 404) {
          return NextResponse.json(
            { error: "Mojang에 등록되지 않은 비정품(또는 잘못된) 닉네임입니다." },
            { status: 404 }
          );
        }
      } catch {}
    }

    if (!uuid) {
      return NextResponse.json(
        { error: "마인크래프트 계정 조회 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 }
      );
    }

    // 디스코드 웹후크 전송
    const rawWebhook = process.env.DISCORD_WEBHOOK_URL || "";
    const webhookUrl = rawWebhook.replace(/^\uFEFF/, "").trim();

    if (webhookUrl && webhookUrl.startsWith("https://")) {
      const discordRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "MC 정품스캐너",
          avatar_url: `https://surgeplay.com{uuid}`,
          embeds: [
            {
              title: "✅ 신규 정품 및 IP 인증 완료",
              color: 0x00a651,
              thumbnail: { url: `https://surgeplay.com{uuid}` },
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
