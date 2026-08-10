/// <reference types="vite/client" />

declare module "*.glb";
declare module "*.png";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
