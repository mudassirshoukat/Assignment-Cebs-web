import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { DialogService } from "../services/dialog.service";
import { ApiError } from "../../core/models/error.model";

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const router = inject(Router);
  const messageService = inject(MessageService);
  const dialogService = inject(DialogService);

  const GENERIC_TITLE = 'Server Error';
  const GENERIC_DETAIL = 'An unexpected error occurred. Please try again.';

  const handleUnauthorized = (apiError: ApiError, mappedErrors?: string[]): void => {
    messageService.add({
      severity: 'error',
      summary: apiError.title,
      detail: apiError.detail,
    });

    dialogService.showError(apiError.title, apiError.detail!, mappedErrors);
  };

  const handleSessionExpired = (): void => {
    dialogService.showSessionExpire();
    router.navigate(['/auth/login']);

    messageService.add({
      severity: 'warn',
      summary: 'Session Expired',
      detail: 'Your session has expired. Please log in again.',
    });
  };


 return next(req).pipe(
  catchError((error: HttpErrorResponse) => {
    console.log("Error caught in interceptor:", error);

    const apiError = error.error as ApiError | undefined;

    /**
     * 🔥 Convert ANY backend format into simple string[]
     */
    let mappedErrors: string[] | undefined;

    if (apiError?.errors) {
      const errs = apiError.errors;

      // --- Case 1: ValidationError[] array ---
      if (Array.isArray(errs)) {
        mappedErrors = errs.map(e => e.description);
      }

      // --- Case 2: dictionary { key: string[] } ---
      else if (typeof errs === 'object' && errs !== null) {
        mappedErrors = Object.values(errs)
          .flat()
          .filter(Boolean) as string[];
      }
    }

    // If no errors field or empty
    if (!mappedErrors || mappedErrors.length === 0)
      mappedErrors = undefined;

    // ↓↓↓ The rest of your logic stays the same ↓↓↓

    if (error.status === 401 && !apiError) {
      handleSessionExpired();
      return throwError(() => error);
    }

    if (error.status === 403) {
      router.navigate(['page/forbidden']);
      return throwError(() => error);
    }

    if (apiError) {
      if ((apiError.type || "").toLowerCase() === "validation") {
        dialogService.showError(apiError.title, apiError.detail!, mappedErrors);
      }
      else if (apiError.isFriendly) {
        dialogService.showError(apiError.title, apiError.detail!, mappedErrors);
      }
      else if (error.status === 401) {
        handleUnauthorized(apiError, mappedErrors);
      }
      else {
        dialogService.showError(GENERIC_TITLE, GENERIC_DETAIL);
      }

      return throwError(() => apiError);
    }

    dialogService.showError(GENERIC_TITLE, GENERIC_DETAIL);
    return throwError(() => error);
  })
);
};
