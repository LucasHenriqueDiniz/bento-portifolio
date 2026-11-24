/**
 * World of Warcraft: Forever character, read from the Battle.net API.
 *
 * Same approach as WeebProfile's wow_forever plugin: the application authenticates with
 * its own client (client credentials grant), since a Forever character is public.
 * Forever has no realms; a character is addressed as `{name}-{surname}` in the
 * `profile-forever-{region}` namespace.
 */

const OAUTH_URL = "https://oauth.battle.net/token";
const TIMEOUT_MS = 8000;
/** Renew a cached token this long before Blizzard says it expires. */
const EXPIRY_MARGIN_MS = 5 * 60_000;

/** Cosmetic slots, or a stack of arrows: they say little about the character. */
const HIDDEN_SLOTS = new Set(["SHIRT", "TABARD", "AMMO"]);

export interface WowCredentials {
  clientId: string;
  clientSecret: string;
}

export interface WowItem {
  slot: string;
  name: string;
  /** "POOR" | "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | … as the API names it. */
  quality: string;
  itemLevel: number | null;
}

export interface WowProfession {
  name: string;
  value: number;
  max: number;
}

export interface WowStat {
  key: string;
  label: string;
  value: number;
}

export interface WowCharacterData {
  region: string;
  slug: string;
  name: string;
  surname: string;
  level: number;
  race: string | null;
  className: string | null;
  faction: string | null;
  guild: string | null;
  averageItemLevel: number | null;
  /** Full-body render with a transparent background, and the small portrait. */
  renderUrl: string | null;
  avatarUrl: string | null;
  equipment: WowItem[];
  stats: WowStat[];
  professions: WowProfession[];
}

let cachedToken: { clientId: string; token: string; expiresAt: number } | null = null;

/** Test hook: the cache outlives a test otherwise. */
export function clearWowTokenCache(): void {
  cachedToken = null;
}

async function accessToken({ clientId, clientSecret }: WowCredentials): Promise<string> {
  if (cachedToken && cachedToken.clientId === clientId && cachedToken.expiresAt > Date.now()) return cachedToken.token;
  const response = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // The body can echo the request; only the status leaves this function.
  if (!response.ok) throw new Error(`battle.net refused the application's credentials (${response.status})`);
  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) throw new Error("battle.net returned no access token");
  cachedToken = {
    clientId,
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 - EXPIRY_MARGIN_MS,
  };
  return cachedToken.token;
}

interface Named {
  name?: string;
}

interface ProfileResponse {
  name?: string;
  surname?: string;
  level?: number;
  race?: Named;
  character_class?: Named;
  faction?: Named;
  guild?: Named;
  average_item_level?: number;
}

interface MediaResponse {
  assets?: Array<{ key?: string; value?: string }>;
}

interface EquipmentResponse {
  equipped_items?: Array<{
    slot?: { type?: string; name?: string };
    name?: string;
    quality?: { type?: string };
    level?: { value?: number };
  }>;
}

interface StatisticsResponse {
  health?: number;
  power?: number;
  power_type?: Named;
  armor?: { effective?: number };
  strength?: { effective?: number };
  agility?: { effective?: number };
  stamina?: { effective?: number };
  intellect?: { effective?: number };
  spirit?: { effective?: number };
}

interface ProfessionEntry {
  profession?: Named;
  skill_points?: number;
  max_skill_points?: number;
  tiers?: Array<{ skill_points?: number; max_skill_points?: number }>;
}

interface ProfessionsResponse {
  primaries?: ProfessionEntry[];
  secondaries?: ProfessionEntry[];
}

const text = (value: unknown) => (typeof value === "string" && value ? value : null);
const number = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);

export function mapEquipment(response: EquipmentResponse | null): WowItem[] {
  return (response?.equipped_items ?? []).flatMap((item) => {
    const name = text(item.name);
    if (!name || HIDDEN_SLOTS.has(item.slot?.type ?? "")) return [];
    return [
      {
        slot: text(item.slot?.name) ?? "",
        name,
        quality: text(item.quality?.type) ?? "COMMON",
        itemLevel: number(item.level?.value),
      },
    ];
  });
}

export function mapStats(response: StatisticsResponse | null): WowStat[] {
  if (!response) return [];
  const rows: Array<[string, string, unknown]> = [
    ["health", "Health", response.health],
    ["power", text(response.power_type?.name) ?? "Power", response.power],
    ["strength", "Strength", response.strength?.effective],
    ["agility", "Agility", response.agility?.effective],
    ["stamina", "Stamina", response.stamina?.effective],
    ["intellect", "Intellect", response.intellect?.effective],
    ["spirit", "Spirit", response.spirit?.effective],
    ["armor", "Armor", response.armor?.effective],
  ];
  return rows.flatMap(([key, label, value]) => {
    const n = number(value);
    return n === null ? [] : [{ key, label, value: n }];
  });
}

/** Primary professions, then secondary ones, each at its highest tier. */
export function mapProfessions(response: ProfessionsResponse | null): WowProfession[] {
  return [...(response?.primaries ?? []), ...(response?.secondaries ?? [])].flatMap((entry) => {
    const tier = entry.tiers?.[entry.tiers.length - 1];
    const value = number(tier?.skill_points ?? entry.skill_points);
    const max = number(tier?.max_skill_points ?? entry.max_skill_points);
    const name = text(entry.profession?.name);
    return name && value !== null && max ? [{ name, value, max }] : [];
  });
}

/**
 * Reads the character. The profile is required and its failure throws; the other parts
 * are optional, since Blizzard serves them late or not at all for a new character.
 */
export async function fetchWowCharacter(
  credentials: WowCredentials,
  region: string,
  slug: string
): Promise<WowCharacterData> {
  const token = await accessToken(credentials);
  const base = `https://${region}.api.blizzard.com/profile/wow/character/${encodeURIComponent(slug)}`;
  const query = `?namespace=profile-forever-${region}&locale=en_US`;
  const get = async <T>(route: string): Promise<T> => {
    const response = await fetch(`${base}${route}${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`battle.net character${route} request failed (${response.status})`);
    return (await response.json()) as T;
  };
  const optional = <T>(route: string) => get<T>(route).catch(() => null);

  const [profile, media, equipment, statistics, professions] = await Promise.all([
    get<ProfileResponse>(""),
    optional<MediaResponse>("/character-media"),
    optional<EquipmentResponse>("/equipment"),
    optional<StatisticsResponse>("/statistics"),
    optional<ProfessionsResponse>("/professions"),
  ]);
  const name = text(profile.name);
  if (!name) throw new Error("battle.net returned a profile without a name");

  const asset = (key: string) => text(media?.assets?.find((a) => a.key === key)?.value);
  return {
    region,
    slug,
    name,
    surname: text(profile.surname) ?? "",
    level: number(profile.level) ?? 0,
    race: text(profile.race?.name),
    className: text(profile.character_class?.name),
    faction: text(profile.faction?.name),
    guild: text(profile.guild?.name),
    averageItemLevel: number(profile.average_item_level),
    renderUrl: asset("main-raw"),
    avatarUrl: asset("avatar"),
    equipment: mapEquipment(equipment),
    stats: mapStats(statistics),
    professions: mapProfessions(professions),
  };
}
