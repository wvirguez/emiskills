/** Errores tipados del cliente de Hotmart. Los mensajes nunca incluyen secretos ni tokens. */

export class HotmartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class HotmartAuthError extends HotmartError {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class HotmartRateLimitError extends HotmartError {
  /** Segundos sugeridos por Hotmart (cabecera Retry-After), si los hay. */
  readonly retryAfter: number | null;
  constructor(message: string, retryAfter: number | null) {
    super(message);
    this.retryAfter = retryAfter;
  }
}

export class HotmartApiError extends HotmartError {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class HotmartNetworkError extends HotmartError {}

export class HotmartResponseError extends HotmartError {}
