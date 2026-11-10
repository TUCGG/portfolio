export type Post = {title: string; url: string; publishedAt: Date};
export type PinnedPost = {title: string; url: string};

const ENTITIES: Record<string, string> = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"};

/** item 안에서 태그의 첫 값을 읽는다. CDATA면 그대로, 아니면 기본 엔티티를 푼다. */
function readTag(item: string, tag: string): string | undefined {
  const match = item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return undefined;
  const raw = match[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return cdata ? cdata[1] : raw.replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e]);
}

// shortcut: XML 라이브러리 없이 velog 피드 형식만 읽는다. 다른 피드를 읽게 되면 파서를 쓴다.
export function parseVelogRss(xml: string): Post[] {
  // 본문(description) CDATA 안의 <link>, </item> 같은 문자열에 속지 않도록 먼저 지운다.
  // CDATA 안에는 "]]>"가 나올 수 없어서 끝 위치가 확실하다.
  const body = xml.replace(/<description><!\[CDATA\[[\s\S]*?\]\]><\/description>/g, '');
  const posts: Post[] = [];

  for (const [, item] of body.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = readTag(item, 'title');
    const url = readTag(item, 'link');
    const publishedAt = new Date(readTag(item, 'pubDate') ?? '');
    if (!title || !url || Number.isNaN(publishedAt.getTime())) continue;
    posts.push({title, url, publishedAt});
  }

  return posts;
}

/** 빌드할 때 최신 글을 가져온다. 실패해도 빌드를 멈추지 않고 빈 배열을 돌려준다. */
export async function fetchVelogPosts(handle: string, limit = 5): Promise<Post[]> {
  const url = `https://v2.velog.io/rss/@${handle}`;
  try {
    const res = await fetch(url, {signal: AbortSignal.timeout(5000)});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = parseVelogRss(await res.text());
    if (posts.length === 0) console.warn(`[velog] ${url}에서 글을 찾지 못했습니다.`);
    return posts.slice(0, limit);
  } catch (error) {
    console.warn(`[velog] ${url} 요청 실패: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/** 최근 글에서 대표 글과 같은 주소를 뺀다. */
export function mergePosts(pinned: PinnedPost[], recent: Post[]): {pinned: PinnedPost[]; recent: Post[]} {
  const pinnedUrls = new Set(pinned.map((p) => p.url));
  return {pinned, recent: recent.filter((p) => !pinnedUrls.has(p.url))};
}
