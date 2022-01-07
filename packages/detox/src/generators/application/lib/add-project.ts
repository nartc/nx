import {
  addProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';
import { NormalizedSchema } from './normalize-options';

export function addProject(host: Tree, options: NormalizedSchema) {
  addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    targets: { ...getTargets(options) },
    tags: [],
    implicitDependencies: options.project ? [options.project] : undefined,
  });
}

export function addE2eTargets(name: string): {
  [key: string]: TargetConfiguration;
} {
  return {
    'e2e-ios': {
      executor: '@nrwl/workspace:run-commands',
      options: {
        commands: [`nx build-ios ${name}`, `nx test-ios ${name}`],
        parallel: false,
      },
      configurations: {
        production: {
          args: '--prod',
        },
      },
    },
    'e2e-android': {
      executor: '@nrwl/workspace:run-commands',
      options: {
        commands: [`nx build-android ${name}`, `nx test-android ${name}`],
        parallel: false,
      },
      configurations: {
        production: {
          args: '--prod',
        },
      },
    },
  };
}

function getTargets(options: NormalizedSchema) {
  const architect: { [key: string]: TargetConfiguration } = addE2eTargets(
    options.name
  );

  architect['build-ios'] = {
    executor: '@nrwl/detox:build',
    options: {
      detoxConfiguration: 'ios.sim.debug',
    },
    configurations: {
      production: {
        detoxConfiguration: 'ios.sim.release',
      },
    },
  };

  architect['test-ios'] = {
    executor: '@nrwl/detox:test',
    options: {
      detoxConfiguration: 'ios.sim.debug',
    },
    configurations: {
      production: {
        detoxConfiguration: 'ios.sim.release',
      },
    },
  };

  architect['build-android'] = {
    executor: '@nrwl/detox:build',
    options: {
      detoxConfiguration: 'android.emu.debug',
    },
    configurations: {
      production: {
        detoxConfiguration: 'android.emu.release',
      },
    },
  };

  architect['test-android'] = {
    executor: '@nrwl/detox:test',
    options: {
      detoxConfiguration: 'android.emu.debug',
    },
    configurations: {
      production: {
        detoxConfiguration: 'android.emu.release',
      },
    },
  };

  return architect;
}
