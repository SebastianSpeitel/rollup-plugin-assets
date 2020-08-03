import { createFilter, FilterPattern, dataToEsm } from "@rollup/pluginutils";
import { basename } from "path";
import { promises as fs } from "fs";

interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  encoding?: BufferEncoding;
}
const PREFIX = "asset:";
const EXPORTS = {
  path: "path",
  source: "source"
};

export default function assets(options: Options = {}) {
  const filter = createFilter(options.include ?? /^asset:.*/, options.exclude);
  const encoding = options.encoding ?? "base64";

  const Assets: Plugin = {
    name: "assets",
    async resolveId(id, importer) {
      if (!filter(id)) return null;

      const plainId = id.startsWith(PREFIX) ? id.slice(PREFIX.length) : id;
      const result = await this.resolve(plainId, importer);
      if (!result) {
        this.warn(`Coudn't resolve asset ${plainId} (imported by ${importer})`);
        return;
      }

      return PREFIX + result.id;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) return null;

      const assetPath = id.slice(PREFIX.length);
      const buffer = await fs.readFile(assetPath);

      const refId = this.emitFile({
        type: "asset",
        name: basename(id),
        source: buffer
      });

      let code = `export const ${EXPORTS.path} = import.meta.ROLLUP_FILE_URL_${refId};`;

      const encoded = buffer.toString(encoding);

      code += dataToEsm({ [EXPORTS.source]: encoded }, { namedExports: true });

      return {
        code,
        moduleSideEffects: false
      } as SourceDescription;
    },
    resolveFileUrl({ moduleId, relativePath, format }) {
      if (!moduleId.startsWith(PREFIX)) return;

      switch (format) {
        case "cjs":
          return `__dirname+${JSON.stringify("/" + relativePath)}`;
        case "es":
          return `new URL(${JSON.stringify(
            relativePath
          )},import.meta.url).pathname`;
      }
    },
    }
  };

  return Assets;
}
