import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBaseUrl = 'http://localhost:8080/api';

  if (req.url.startsWith(apiBaseUrl) || req.url.startsWith('/api')) {
    const clonedRequest = req.clone({
      withCredentials: true
    });
    return next(clonedRequest);
  }

  return next(req);
};
