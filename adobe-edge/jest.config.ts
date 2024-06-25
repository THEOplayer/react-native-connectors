import baseConfig from "../jest.config.base"
import { Config } from "jest";

const config: Config = {
  ...baseConfig,
  rootDir: '..'
}

export default config;
