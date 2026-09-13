import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';

const eslint = new ESLint();
const tsPath = 'tools/fixtures/lint/sample.ts';
async function diagnostics(code, filePath = tsPath) {
  const results = await eslint.lintText(code, { filePath });
  return results.flatMap(result => result.messages);
}
async function rejects(code, rule, filePath) {
  const messages = await diagnostics(code, filePath);
  assert(messages.some(message => message.ruleId === rule), JSON.stringify(messages));
}
const component = body => `
import { Component, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval${body.includes('switchMap') ? ', switchMap' : ''} } from 'rxjs';
@Component({selector: 'app-probe', template: '', changeDetection: ChangeDetectionStrategy.OnPush})
export class Probe {
  private readonly destroyRef = inject(DestroyRef);
  start() { ${body} }
}`;

test('rejects explicit any, including in tests', async () => {
  await rejects('export const value: any = 1;', '@typescript-eslint/no-explicit-any');
});
test('accepts typed values', async () => {
  assert.deepEqual(await diagnostics('export const value: unknown = 1;'), []);
});
test('rejects subscription without lifecycle cleanup', async () => {
  await rejects(component('interval(1000).subscribe();'), 'rxjs-angular-x/prefer-takeuntil');
});
test('accepts takeUntilDestroyed without requiring a manual destroy Subject', async () => {
  const messages = await diagnostics(component('interval(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();'));
  assert.deepEqual(messages, []);
});
test('rejects higher-order operators after lifecycle cleanup', async () => {
  await rejects(component('interval(1000).pipe(takeUntilDestroyed(this.destroyRef), switchMap(() => interval(100))).subscribe();'), 'rxjs-x/no-unsafe-takeuntil');
});
test('rejects dynamic evaluation', async () => {
  await rejects('export const value = eval("1");', 'no-eval');
});
test('checks external template accessibility', async () => {
  await rejects('<img src="example.svg">', '@angular-eslint/template/alt-text', 'src/app/probe.component.html');
});
test('checks inline template accessibility', async () => {
  await rejects(`import { Component } from '@angular/core';
@Component({selector: 'app-probe', template: '<img src="example.svg">'})
export class Probe {}`, '@angular-eslint/template/alt-text', 'tools/fixtures/lint/sample.component.ts');
});

test('rejects explicit any in a spec file', async () => {
  await rejects('export const value: any = 1;', '@typescript-eslint/no-explicit-any', 'tools/fixtures/lint/sample.spec.ts');
});
test('rejects subscriptions in injectable services too', async () => {
  await rejects(`import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
@Injectable({providedIn: 'root'}) export class Probe { start() { interval(10).subscribe(); } }`, 'rxjs-angular-x/prefer-takeuntil');
});
test('rejects ngClass and template any escapes', async () => {
  await rejects('<div [ngClass]="classes"></div>', '@angular-eslint/template/prefer-class-binding', 'src/app/probe.component.html');
  await rejects('<div>{{ $any(value) }}</div>', '@angular-eslint/template/no-any', 'src/app/probe.component.html');
});
test('accepts an accessible external template', async () => {
  assert.deepEqual(await diagnostics('<button type="button">Save</button>', 'src/app/probe.component.html'), []);
});

test('rejects redundant Angular standalone declarations but accepts unrelated properties', async () => {
  await rejects(`import { Component } from '@angular/core';
@Component({selector: 'app-probe', standalone: true, template: ''})
export class Probe {}`, 'no-restricted-syntax');
  assert.deepEqual(await diagnostics('export const options = { standalone: true };'), []);
});
test('rejects untyped reactive form imports', async () => {
  await rejects(`import { UntypedFormControl } from '@angular/forms';
export const control = new UntypedFormControl('');`, 'no-restricted-imports');
});
test('rejects unhandled promises', async () => {
  await rejects('Promise.resolve(1);', '@typescript-eslint/no-floating-promises');
});
test('accepts teardown in a constructor injection context', async () => {
  assert.deepEqual(await diagnostics(`import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
@Injectable({providedIn: 'root'}) export class Probe {
  constructor() { interval(10).pipe(takeUntilDestroyed()).subscribe(); }
}`), []);
});

test('accepts implicit OnPush on stable Angular and rejects opting out', async () => {
  assert.deepEqual(await diagnostics(`import { Component } from '@angular/core';
@Component({selector: 'app-probe', template: ''}) export class Probe {}`), []);
  await rejects(`import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({selector: 'app-probe', template: '', changeDetection: ChangeDetectionStrategy.Eager})
export class Probe {}`, '@angular-eslint/prefer-on-push-component-change-detection');
});
