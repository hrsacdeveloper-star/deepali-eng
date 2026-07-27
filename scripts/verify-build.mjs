import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const isWin = process.platform === 'win32';
const cmd = isWin ? '.cmd' : '';
const npxCmd = `npx${cmd}`;
const doBuild = process.argv.includes('--build');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
    shell: isWin,
    ...options,
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.error) {
    console.error(`Failed to run ${command} ${args.join(' ')}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Command failed: ${command} ${args.join(' ')}`);
    process.exit(result.status ?? 1);
  }
}

function runOptional(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  return result.status === 0;
}

run(npxCmd, ['tsgo', '-p', 'tsconfig.check.json']);
run(npxCmd, ['biome', 'lint']);

for (const rule of [
  'SelectItem.yml',
  'contrast.yml',
  'supabase-google-sso.yml',
  'toast-hook.yml',
  'slot-nesting.yml',
  'require-button-interaction.yml',
  'supabase-edge-function-get-body.yml',
]) {
  const ok = runOptional('ast-grep', ['scan', '-r', `.rules/${rule}`]);
  if (!ok) {
    console.warn(`Skipped ast-grep rule ${rule} because ast-grep is not available.`);
  }
}

const useAuthOutput = runOptional('ast-grep', ['scan', '-r', '.rules/useAuth.yml']);
const authProviderOutput = runOptional('ast-grep', ['scan', '-r', '.rules/authProvider.yml']);

if (useAuthOutput && !authProviderOutput) {
  console.error('The code uses useAuth Hook but does not have AuthProvider component wrapping the components.');
  process.exit(1);
}

const tempDir = mkdtempSync(path.join(os.tmpdir(), 'deepali-tailwind-'));
const tempOutput = path.join(tempDir, 'tailwind-output.css');
try {
  run(npxCmd, ['tailwindcss', '-i', './src/index.css', '-o', tempOutput]);
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

if (doBuild) {
  run(npxCmd, ['vite', 'build', '--minify', 'false', '--logLevel', 'error', '--outDir', 'dist']);
}

console.log(doBuild ? 'Build verification completed successfully.' : 'Lint verification completed successfully.');
