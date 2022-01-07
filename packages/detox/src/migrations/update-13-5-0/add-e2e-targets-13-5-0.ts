import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  getProjects,
  updateProjectConfiguration,
} from '@nrwl/devkit';

import { addE2eTargets } from '../../generators/application/lib/add-project';

/**
 * This function add e2e-ios and e2e-android to project's targets
 */
export default async function update(tree: Tree) {
  const projects = getProjects(tree);

  for (const [name, config] of projects.entries()) {
    if (config.targets?.['build-ios']?.executor !== '@nrwl/detox:build') return;

    addE2eTargetsDetox(tree, name, config);
  }

  await formatFiles(tree);
}

function addE2eTargetsDetox(
  tree: Tree,
  name: string,
  config: ProjectConfiguration
) {
  if (!config.targets['e2e-ios'] && !config.targets['e2e-android']) {
    config.targets = { ...config.targets, ...addE2eTargets(name) };
  }
  updateProjectConfiguration(tree, name, config);
}
