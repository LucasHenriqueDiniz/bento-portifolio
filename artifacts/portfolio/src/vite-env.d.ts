/// <reference types="vite/client" />

declare module "*.glb";
declare module "*.png";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DISCORD_WEBHOOK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
