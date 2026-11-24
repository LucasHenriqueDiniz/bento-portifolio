import type { WowCharacter } from "@/lib/apiClient";

/**
 * The owner's character as the Battle.net API served it on 2026-11-19 (recorded in
 * WeebProfile's wow_forever plugin). A test fixture, never shown on the site.
 */
export const WOW_CHARACTER: WowCharacter = {
  region: "us",
  slug: "pequeno-ibuprofeno",
  name: "Pequeno",
  surname: "Ibuprofeno",
  level: 31,
  race: "Gnome",
  className: "Priest",
  faction: "Alliance",
  guild: null,
  averageItemLevel: 26,
  renderUrl: "https://render.worldofwarcraft.com/forever-us/character/199/46305479-main-raw.png",
  avatarUrl: "https://render.worldofwarcraft.com/forever-us/character/199/46305479-avatar.jpg",
  equipment: [
    { slot: "Head", name: "Enchanter's Cowl", quality: "UNCOMMON", itemLevel: 33 },
    { slot: "Neck", name: "Sorcerer Collar", quality: "RARE", itemLevel: 22 },
    { slot: "Shoulders", name: "Mantle of Honor", quality: "UNCOMMON", itemLevel: 35 },
    { slot: "Chest", name: "Green Silk Armor", quality: "UNCOMMON", itemLevel: 33 },
    { slot: "Waist", name: "Ivycloth Sash of the Elder", quality: "UNCOMMON", itemLevel: 26 },
    { slot: "Legs", name: "Magistrate's Pantaloons", quality: "RARE", itemLevel: 29 },
    { slot: "Feet", name: "Spidersilk Boots", quality: "RARE", itemLevel: 25 },
    { slot: "Wrist", name: "Bridgebreaker Bindings", quality: "RARE", itemLevel: 29 },
    { slot: "Hands", name: "Ivycloth Gloves of the Prophet", quality: "UNCOMMON", itemLevel: 26 },
    { slot: "Ring 1", name: "Seal of Wrynn", quality: "RARE", itemLevel: 31 },
    { slot: "Ring 2", name: "Ring of Forlorn Spirits", quality: "UNCOMMON", itemLevel: 35 },
    { slot: "Trinket 1", name: "Worgenbane Talisman", quality: "RARE", itemLevel: 26 },
    { slot: "Back", name: "Vital Cape of Healing", quality: "UNCOMMON", itemLevel: 32 },
    { slot: "Main Hand", name: "Staff of Westfall", quality: "RARE", itemLevel: 24 },
    { slot: "Ranged", name: "Consecrated Wand", quality: "UNCOMMON", itemLevel: 30 },
  ],
  stats: [
    { key: "health", label: "Health", value: 727 },
    { key: "power", label: "Mana", value: 2751 },
    { key: "strength", label: "Strength", value: 24 },
    { key: "agility", label: "Agility", value: 34 },
    { key: "stamina", label: "Stamina", value: 49 },
    { key: "intellect", label: "Intellect", value: 149 },
    { key: "spirit", label: "Spirit", value: 91 },
    { key: "armor", label: "Armor", value: 408 },
  ],
  professions: [
    { name: "Tailoring", value: 81, max: 150 },
    { name: "Engineering", value: 150, max: 150 },
    { name: "Cooking", value: 1, max: 75 },
  ],
};
