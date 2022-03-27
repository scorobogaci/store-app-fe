import {Config} from "./config-definition";
import {environment} from "../../environments/environment";
import {CONFIG_TEST} from "./config.test";
import {CONFIG_PROD} from "./config.prod";
import {CONFIG_DEV} from "./config.dev";

export function getEnvironmentConfig(): Config {
  return environment.production ? CONFIG_PROD : environment.test ? CONFIG_TEST : CONFIG_DEV;
}

export const CONFIG: Config = getEnvironmentConfig();
