/**
 * The voxel zombie game, still without a name. Everything the home card and the game's
 * page say about it comes from here, so naming it later is a change in one place.
 */

export interface Localized {
  pt: string;
  en: string;
}

export const voxelGame = {
  /** The page's path. It does not carry the name, so it survives the naming. */
  path: "/games/voxel-zombie",
  /** Working title until the game has a name. */
  name: "Unnamed Voxel Zombie Game",
  hasFinalName: false,
  /** Rough share of the way to a playable demo, shown as the bar on the home card. */
  progress: 10,
  tagline: {
    pt: "Sobrevivência em primeira pessoa contra zumbis feitos de voxel, onde cada golpe arranca um pedaço.",
    en: "First-person survival against zombies made of voxels, where every blow tears a piece off.",
  } satisfies Localized,
  stage: { pt: "Protótipo", en: "Prototype" } satisfies Localized,
  stack: ["Godot 4.7", "C#", "GDScript", "Jolt Physics"],
  /**
   * Screenshots, in the order they are shown. Put the files under
   * `public/games/voxel-zombie/` and list them here; the first one becomes the hero
   * picture. While this is empty the page shows placeholders in their place.
   */
  screenshots: [] as Array<{ src: string; alt: Localized }>,
  pillars: [
    {
      id: "melee",
      title: { pt: "Golpe que arranca voxel", en: "Blows that tear voxels" },
      text: {
        pt: "O corpo a corpo é o centro do jogo. O golpe abre o zumbi: pele, carne e osso aparecem, membros são decepados e pedaços se soltam.",
        en: "Melee is the centre of the game. A blow opens the zombie up: skin, flesh and bone show, limbs come off and pieces break loose.",
      },
    },
    {
      id: "body",
      title: { pt: "Zumbi com corpo de gente", en: "Zombies with a human body" },
      text: {
        pt: "Esqueleto com limite em cada junta, joelho e cotovelo que só dobram para um lado, peso. Cair, rolar e escorregar são física, não troca de pose.",
        en: "A skeleton with a limit on every joint, knees and elbows that bend one way only, weight. Falling, rolling and sliding are physics, not a pose swap.",
      },
    },
    {
      id: "survival",
      title: { pt: "Sobreviver, não só bater", en: "Surviving, not just hitting" },
      text: {
        pt: "Dia e noite, clima, casas para entrar, loot e inventário, com zumbis que enxergam e escutam.",
        en: "Day and night, weather, houses to get into, loot and an inventory, with zombies that see and hear.",
      },
    },
    {
      id: "world",
      title: { pt: "Um mundo de 1998 a 2002", en: "A world from 1998 to 2002" },
      text: {
        pt: "Carros, móveis, roupas e objetos modelados a partir de referências da virada do milênio, numa grade de voxels de 2 cm.",
        en: "Cars, furniture, clothes and objects modelled on turn-of-the-millennium references, on a 2 cm voxel grid.",
      },
    },
  ] as Array<{ id: string; title: Localized; text: Localized }>,
};
