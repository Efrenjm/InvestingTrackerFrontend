import '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { getApiErrorCode, getApiErrorMessage } from './api-error.mapper';

describe('API error mapper', () => {
  it('reads detail and code from an RFC problem response', () => {
    const error = new HttpErrorResponse({
      status: 401,
      error: {
        code: 'INVALID_CREDENTIALS',
        detail: 'Invalid credentials'
      }
    });

    expect(getApiErrorMessage(error, 'Fallback')).toBe('Invalid credentials');
    expect(getApiErrorCode(error)).toBe('INVALID_CREDENTIALS');
  });

  it('supports legacy JSON messages and plain text responses', () => {
    const jsonError = new HttpErrorResponse({ status: 400, error: { message: 'Legacy message' } });
    const textError = new HttpErrorResponse({ status: 400, error: 'Plain text message' });

    expect(getApiErrorMessage(jsonError, 'Fallback')).toBe('Legacy message');
    expect(getApiErrorMessage(textError, 'Fallback')).toBe('Plain text message');
  });

  it('uses the fallback for an empty or unknown error body', () => {
    const error = new HttpErrorResponse({ status: 500, error: null });

    expect(getApiErrorMessage(error, 'Fallback')).toBe('Fallback');
    expect(getApiErrorCode(error)).toBeUndefined();
  });
});
