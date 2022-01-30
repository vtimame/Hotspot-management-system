import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

const YAML_CONFIG_FILENAME = `config.${process.env.NODE_ENV}.yml`;

const configuration = () => {
  return yaml.load(readFileSync(YAML_CONFIG_FILENAME, 'utf8')) as Record<
    string,
    any
  >;
};

export { configuration };
