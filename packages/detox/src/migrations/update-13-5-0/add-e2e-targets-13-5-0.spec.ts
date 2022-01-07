import { addProjectConfiguration, getProjects, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import update from './add-e2e-targets-13-5-0';

describe('add-e2e-targets-13-5-0', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'products-e2e', {
      root: 'apps/products-e2e',
      sourceRoot: 'apps/products-e2e/src',
      targets: {
        'build-ios': {
          executor: '@nrwl/detox:build',
          options: {
            detoxConfiguration: 'ios.sim.debug',
          },
          configurations: {
            production: {
              detoxConfiguration: 'ios.sim.release',
            },
          },
        },
      },
    });
  });

  it(`should update project.json with targets e2e`, async () => {
    await update(tree);

    getProjects(tree).forEach((project) => {
      expect(project.targets['e2e-ios']).toEqual({
        executor: '@nrwl/workspace:run-commands',
        options: {
          commands: [`nx build-ios products-e2e`, `nx test-ios products-e2e`],
          parallel: false,
        },
        configurations: {
          production: {
            args: '--prod',
          },
        },
      });

      expect(project.targets['e2e-android']).toEqual({
        executor: '@nrwl/workspace:run-commands',
        options: {
          commands: [
            `nx build-android products-e2e`,
            `nx test-android products-e2e`,
          ],
          parallel: false,
        },
        configurations: {
          production: {
            args: '--prod',
          },
        },
      });
    });
  });
});
