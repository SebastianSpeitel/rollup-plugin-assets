import ts from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { builtinModules } from "module";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    { format: "cjs", file: pkg.main, exports: "auto" },
    { format: "esm", file: pkg.module }
  ],
  plugins: [commonjs(), resolve(), ts({ sourceMap: false })],
  external: [...builtinModules, ...Object.keys(pkg.dependencies)]
};
