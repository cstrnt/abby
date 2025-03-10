import type { ABConfig, AbbyConfig, RemoteConfigValueString } from ".";
import type { ValidatorType } from "./validation";

export const DYNAMIC_ABBY_CONFIG_KEYS = [
  "projectId",
  "currentEnvironment",
  "debug",
  "apiUrl",
  "__experimentalCdnUrl",
] as const satisfies readonly (keyof AbbyConfig)[];

export type DynamicConfigKeys = (typeof DYNAMIC_ABBY_CONFIG_KEYS)[number];

export function defineConfig<
  const FlagName extends string,
  const Tests extends Record<string, ABConfig>,
  const RemoteConfig extends Record<RemoteConfigName, RemoteConfigValueString>,
  const RemoteConfigName extends Extract<keyof RemoteConfig, string>,
  const User extends Record<string, ValidatorType> = Record<
    string,
    ValidatorType
  >,
>(
  dynamicConfig: Pick<
    AbbyConfig<FlagName, Tests, string[], RemoteConfigName, RemoteConfig, User>,
    DynamicConfigKeys
  >,
  config: Omit<
    AbbyConfig<FlagName, Tests, string[], RemoteConfigName, RemoteConfig, User>,
    DynamicConfigKeys
  >
) {
  return { ...dynamicConfig, ...config };
}
