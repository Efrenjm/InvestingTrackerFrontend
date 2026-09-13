import { readFile, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

// Compodoc rewrites this tracked file. Preserve even pre-existing user edits.
const file = 'documentation.json';
const previous = await readFile(file).catch(error => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
try {
  const result = spawnSync('npm', ['run', 'build-storybook'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  if (previous === null) await rm(file, { force: true });
  else await writeFile(file, previous);
}
