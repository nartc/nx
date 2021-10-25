import * as path from 'path';
import { writeFileSync } from 'fs';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { storybookExecutor, StorybookExecutorOptions } from '@nrwl/storybook';
import { generateLoaderDefinition } from 'react-native-storybook-loader/out/locator';
import { generateTemplate } from 'react-native-storybook-loader/out/template';

export default async function* reactNatievStorybookExecutor(
  options: StorybookExecutorOptions,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  const projectRoot = context.workspace.projects[context.projectName].root;
  generateStoryLoader(context, projectRoot);
  return storybookExecutor(options, context);
}

/**
 * This function generate ./story-loader.js at workspace root file.
 * The ./story-laoder.js file contains the stories to picked up by storybook.
 * This function is similar to https://github.com/elderfo/react-native-storybook-loader/blob/main/src/rnstl-cli.ts.
 * Instead of reading config from package.json, it passed con config as a constant.
 * This story-loader.js file is consumer by storybook file generated by react-native
 * @param context
 * @param projectRoot
 */
function generateStoryLoader(context: ExecutorContext, projectRoot: string) {
  const config = {
    rootDirectory: context.root,
    outputFile: path.join(context.root, './story-loader.js'),
    searchDir: projectRoot,
    pattern: '**/*.stories.@(js|jsx|ts|tsx|md)',
  };

  const loaderDefinition = generateLoaderDefinition(config);

  const template = generateTemplate(loaderDefinition);

  logger.info('Writing to ' + loaderDefinition.outputFile);

  writeFileSync(loaderDefinition.outputFile, template);
}
