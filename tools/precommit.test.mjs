import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, copyFile, symlink, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

// Exercise the real hook in a disposable Git repository. Never stage or commit
// in the application repository. Reuse existing history; create no commits.
test('pre-commit rejects staged any and accepts staged typed code', async () => {
  const root = process.cwd();
  const dir = await mkdtemp(join(tmpdir(), 'frontend-precommit-'));
  // Git exports repository-local variables to hooks; never forward them to the fixture.
  const isolatedEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  const run = (command, args) => spawnSync(command, args, {
    cwd: dir, encoding: 'utf8',
    env: { ...isolatedEnv, HUSKY: '1', PATH: `${join(root, 'node_modules/.bin')}:${process.env.PATH}` },
  });
  try {
    assert.equal(run('git', ['clone', '--shared', '--quiet', root, dir]).status, 0);
    await mkdir(join(dir, '.husky'), { recursive: true });
    await mkdir(join(dir, 'src'), { recursive: true });
    for (const file of ['eslint.config.mjs', 'tsconfig.json', 'tsconfig.eslint.json', 'lint-staged.config.mjs', '.husky/pre-commit']) {
      await copyFile(join(root, file), join(dir, file));
    }
    await symlink(join(root, 'node_modules'), join(dir, 'node_modules'), 'dir');
    await writeFile(join(dir, 'package.json'), JSON.stringify({ private: true, scripts: { precommit: 'lint-staged --concurrent false', 'check:storybook': 'node -e "process.exit(7)"' } }));
    await writeFile(join(dir, '.gitignore'), 'node_modules/\n');
    assert.equal(run(process.execPath, [join(root, 'node_modules/husky/bin.js')]).status, 0);
    const file = join(dir, 'src/probe.ts');
    await writeFile(file, 'export const value: any = 1;\n');
    assert.equal(run('git', ['add', 'src/probe.ts']).status, 0);
    // An unstaged correction must not let the invalid staged version through.
    await writeFile(file, 'export const value: unknown = 1;\n');
    const rejected = run('sh', ['.husky/_/pre-commit']);
    assert.notEqual(rejected.status, 0, rejected.stdout + rejected.stderr);
    assert.match(rejected.stdout + rejected.stderr, /no-explicit-any/);
    assert.equal(await readFile(file, 'utf8'), 'export const value: unknown = 1;\n');
    assert.equal(run('git', ['add', 'src/probe.ts']).status, 0);
    const accepted = run('sh', ['.husky/_/pre-commit']);
    assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr);
    // Each global build input must independently invoke the Storybook gate.
    for (const buildInput of ['angular.json', 'src/styles.css', 'src/material-theme.scss', '.postcssrc.json']) {
      assert.equal(run('git', ['read-tree', 'HEAD']).status, 0);
      await writeFile(join(dir, buildInput), 'changed build input\n');
      assert.equal(run('git', ['add', buildInput]).status, 0);
      const buildRejected = run('sh', ['.husky/_/pre-commit']);
      assert.notEqual(buildRejected.status, 0, `${buildInput}: ${buildRejected.stdout}${buildRejected.stderr}`);
      assert.match(buildRejected.stdout + buildRejected.stderr, /check:storybook/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
