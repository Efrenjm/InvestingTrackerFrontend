import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

test('Storybook check restores prior generated documentation on success and failure', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'frontend-storybook-check-'));
  const command = resolve('tools/check-storybook.mjs');
  try {
    const bin = join(dir, 'bin');
    await mkdir(bin);
    for (const status of [0, 7]) {
      await writeFile(join(dir, 'documentation.json'), 'previous user content\n');
      await writeFile(join(bin, 'npm'), `#!/bin/sh\nprintf 'generated' > documentation.json\nexit ${status}\n`, { mode: 0o755 });
      const result = spawnSync(process.execPath, [command], {
        cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      });
      assert.equal(result.status, status, result.stdout + result.stderr);
      assert.equal(await readFile(join(dir, 'documentation.json'), 'utf8'), 'previous user content\n');
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
