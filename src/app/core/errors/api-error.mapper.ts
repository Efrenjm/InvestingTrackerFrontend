import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const payload = getPayload(error);

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (isRecord(payload)) {
    if (typeof payload['detail'] === 'string' && payload['detail'].trim()) {
      return payload['detail'];
    }

    if (typeof payload['message'] === 'string' && payload['message'].trim()) {
      return payload['message'];
    }
  }

  return fallback;
}

export function getApiErrorCode(error: unknown): string | undefined {
  const payload = getPayload(error);
  return isRecord(payload) && typeof payload['code'] === 'string'
    ? payload['code']
    : undefined;
}

function getPayload(error: unknown): unknown {
  return error instanceof HttpErrorResponse ? error.error : error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
