/**
 * Adapted from a private function at ng-packagr
 * https://github.com/ng-packagr/ng-packagr/blob/main/src/lib/ts/tsconfig.ts#L12:
 *
 * Changes made:
 * - Added an extra function that updates the configFilePath in the returned parsed options
 * to be the original tsconfig file.
 */

import { resolve } from 'path';
import * as ts from 'typescript';
import { loadEsmModule } from './module-loader';

async function readDefaultTsConfig(fileName: string) {
  // these options are mandatory
  const extraOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,

    // sourcemaps
    sourceMap: false,
    inlineSources: true,
    inlineSourceMap: true,

    outDir: '',
    declaration: true,

    // ng compiler
    enableResourceInlining: true,

    // these are required to set the appropriate EmitFlags
    flatModuleId: 'AUTOGENERATED',
    flatModuleOutFile: 'AUTOGENERATED',
  };

  const { readConfiguration } = await loadEsmModule('@angular/compiler-cli');

  return readConfiguration(fileName, extraOptions);
}

/**
 * Proxy function that ensures the configFilePath option points to the original file path.
 */
export async function parseRemappedTsConfigAndMergeDefaults(
  workspaceRoot: string,
  originalFilePath: string,
  remappedFilePath: string
) {
  const parsedConfiguration = await readDefaultTsConfig(remappedFilePath);
  parsedConfiguration.options.configFilePath = resolve(
    workspaceRoot,
    originalFilePath
  );

  return parsedConfiguration;
}
