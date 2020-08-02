import { FilterPattern } from "@rollup/pluginutils";
import { Plugin } from "rollup";

export interface PluginOptions {
  /**
   * Determine which files are imported as assets.
   */
  include?: FilterPattern;
  /**
   * Determine which files are imported as assets.
   */
  exclude?: FilterPattern;
  /**
   * Encoding of exported `source` string.
   */
  encoding?: BufferEncoding;
}

/**
 * Import asset paths and sources within JS
 */
export default function assets(options?: PluginOptions): Plugin;
