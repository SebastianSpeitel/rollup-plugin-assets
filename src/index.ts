import { createFilter, FilterPattern } from "@rollup/pluginutils";
import type { Plugin, SourceDescription } from "rollup";
import { basename } from "path";
import { promises as fs } from "fs";

interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  encoding?: BufferEncoding;
}
const PREFIX = "asset:";

export default function assets(options: Options = {}) {
  const filter = createFilter(options.include ?? /^asset:.*/, options.exclude);
  const encoding = options.encoding ?? "base64";

  const Assets: Plugin = {
    name: "assets",
    async resolveId(id, importer) {
      if (!filter(id)) return null;

      const plainId = id.slice(PREFIX.length);
      const result = await this.resolve(plainId, importer);
      if (!result) {
        this.warn(`Coudn't resolve asset ${plainId} (imported by ${importer})`);
        return;
      }

      return PREFIX + result.id;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) return null;

      let [, assetPath] = id.split(":", 2);
      const buffer = await fs.readFile(assetPath);

      const refId = this.emitFile({
        type: "asset",
        name: basename(id),
        source: buffer
      });

      let code = `
        export const path = import.meta.ROLLUP_FILE_URL_${refId}.slice(7);
      `.trim();

      code += `
        export const source = ${JSON.stringify(buffer.toString(encoding))};
      `.trim();

      return {
        code,
        syntheticNamedExports: false,
        moduleSideEffects: false
      } as SourceDescription;
    }
  };

  return Assets;
}
