import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";

const PLACEHOLDER = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";

// Shape of a real user.getRecentTracks answer for a track scrobbled from YouTube: the
// channel is the artist, the video title is the track, and Last.fm has no art for it.
const youtubeScrobble = {
  recenttracks: {
    track: [
      {
        artist: { mbid: "", "#text": "Amy Lee" },
        image: [
          { size: "small", "#text": PLACEHOLDER },
          { size: "large", "#text": PLACEHOLDER },
          { size: "extralarge", "#text": PLACEHOLDER },
        ],
        album: { mbid: "", "#text": "" },
        name: "Evanescence - Tourniquet (Remastered 2023) - Official Visualizer",
        url: "https://www.last.fm/music/Amy+Lee/_/Evanescence+-+Tourniquet",
        date: { uts: "1795398689", "#text": "22 Nov 2026, 18:31" },
      },
    ],
  },
};

interface NowPlayingBody {
  isPlaying: boolean;
  timestamp: number | null;
  track: string | null;
  artist: string | null;
  album: string | null;
  albumArt: string | null;
}

const ARTWORK = "https://is1-ssl.mzstatic.com/image/thumb/Music/100x100bb.jpg";

function makeKv(seed: Record<string, string> = {}) {
  const store = new Map(Object.entries(seed));
  return {
    store,
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function stubUpstream({ lastfm, itunes }: { lastfm: () => Response; itunes?: () => Response }) {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      calls.push(url);
      if (url.startsWith("https://ws.audioscrobbler.com")) return lastfm();
      if (url.startsWith("https://itunes.apple.com")) return (itunes ?? (() => jsonResponse({ results: [] })))();
      throw new Error(`unexpected fetch ${url}`);
    })
  );
  return calls;
}

const request = (kv: ReturnType<typeof makeKv>) =>
  onRequest({
    request: new Request("https://x.test/api/portfolio/now-playing"),
    env: { LASTFM_API_KEY: "test-key", LASTFM_USERNAME: "someone", PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(() => {
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("portfolio/now-playing", () => {
  it("finds the art of a YouTube scrobble on iTunes by its cleaned-up title", async () => {
    const calls = stubUpstream({
      lastfm: () => jsonResponse(youtubeScrobble),
      itunes: () => jsonResponse({ results: [{ artworkUrl100: ARTWORK }] }),
    });

    const body = (await (await request(makeKv())).json()) as NowPlayingBody;

    const itunesCall = calls.find((url) => url.startsWith("https://itunes.apple.com"))!;
    expect(new URL(itunesCall).searchParams.get("term")).toBe("Amy Lee Evanescence Tourniquet");
    expect(body).toMatchObject({
      isPlaying: false,
      timestamp: 1795398689000,
      track: "Evanescence - Tourniquet (Remastered 2023) - Official Visualizer",
      artist: "Amy Lee",
      album: null,
      albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music/600x600bb.jpg",
    });
  });

  it("still answers with the track when no art exists anywhere", async () => {
    stubUpstream({ lastfm: () => jsonResponse(youtubeScrobble) });

    const res = await request(makeKv());
    const body = (await res.json()) as NowPlayingBody;

    expect(res.status).toBe(200);
    expect(body.track).toBe("Evanescence - Tourniquet (Remastered 2023) - Official Visualizer");
    expect(body.albumArt).toBeNull();
  });

  it("keeps every good answer as the last known track", async () => {
    stubUpstream({ lastfm: () => jsonResponse(youtubeScrobble) });
    const kv = makeKv();

    const body = await (await request(kv)).json();

    expect(JSON.parse(kv.store.get("lastfm:last-track")!)).toEqual(body);
  });

  it("serves the last known track, no longer playing, when Last.fm fails", async () => {
    stubUpstream({ lastfm: () => jsonResponse({ error: 8, message: "Operation failed" }, 500) });
    const kv = makeKv({
      "lastfm:last-track": JSON.stringify({ isPlaying: true, track: "Tourniquet", artist: "Evanescence", albumArt: ARTWORK }),
    });

    const res = await request(kv);
    const body = (await res.json()) as NowPlayingBody;

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ track: "Tourniquet", artist: "Evanescence", isPlaying: false });
  });

  it("serves the last known track when Last.fm answers without any track", async () => {
    stubUpstream({ lastfm: () => jsonResponse({ recenttracks: { track: [] } }) });
    const kv = makeKv({ "lastfm:last-track": JSON.stringify({ isPlaying: false, track: "Tourniquet" }) });

    const body = (await (await request(kv)).json()) as NowPlayingBody;

    expect(body.track).toBe("Tourniquet");
  });

  it("answers 502 when Last.fm fails and no track was ever stored", async () => {
    stubUpstream({ lastfm: () => jsonResponse({ error: 8 }, 500) });

    const res = await request(makeKv());

    expect(res.status).toBe(502);
  });
});
