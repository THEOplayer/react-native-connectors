type EnvConfig = { [key: string]: string };
interface Window {
  GLOBAL_ENV: EnvConfig;
}
declare const GLOBAL_ENV: EnvConfig;
