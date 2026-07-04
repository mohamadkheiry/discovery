// کلاینت تایپ‌شده‌ی API — پاکت پاسخ را باز می‌کند، CSRF را مدیریت می‌کند و خطاها را به ApiError تبدیل می‌کند.

export interface ApiEnvelopeSuccess<T> {
  ok: true;
  message: string | null;
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiEnvelopeError {
  ok: false;
  message: string;
  errors: Record<string, string[]> | null;
  code: string | null;
}

export type ApiEnvelope<T> = ApiEnvelopeSuccess<T> | ApiEnvelopeError;

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]> | null;
  code: string | null;

  constructor(message: string, status: number, errors: Record<string, string[]> | null, code: string | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

// basePath ثابتِ ساخته‌شده در next.config.ts. چون خروجی static export است، در همه‌جا صریح استفاده می‌شود.
const BASE_PATH = "/discovery";

function getApiBase(): string {
  const envBase = process.env.NEXT_PUBLIC_API_BASE;
  if (envBase && envBase.trim().length > 0) {
    return envBase.replace(/\/$/, "");
  }
  return `${BASE_PATH}/api`;
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
}

// برای تگ <link> فونت که مستقیم روی DOM قرار می‌گیرد (نه fetch)
export function fontCssUrl(): string {
  return apiUrl("font.css.php");
}

// --- مدیریت توکن CSRF در حافظه (ماژول‌سطحی، بین ناوبری‌های SPA زنده می‌ماند) ---
let csrfToken: string | null = null;
let csrfFetchPromise: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(apiUrl("csrf.php"), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const json = (await res.json()) as ApiEnvelope<{ csrf_token: string }>;
  if (!json.ok) {
    throw new ApiError(json.message || "دریافت توکن امنیتی ناموفق بود", res.status, json.errors, json.code);
  }
  csrfToken = json.data.csrf_token;
  return csrfToken;
}

async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (csrfToken && !forceRefresh) return csrfToken;
  if (csrfFetchPromise && !forceRefresh) return csrfFetchPromise;
  csrfFetchPromise = fetchCsrfToken().finally(() => {
    csrfFetchPromise = null;
  });
  return csrfFetchPromise;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
  mutating?: boolean; // اگر true باشد، هدر CSRF ارسال می‌شود
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, isFormData = false, mutating = false } = options;

  const doFetch = async (csrf: string | null): Promise<Response> => {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (mutating && csrf) headers["X-CSRF-Token"] = csrf;

    return fetch(apiUrl(path), {
      method,
      credentials: "include",
      headers,
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let csrf: string | null = null;
  if (mutating) {
    csrf = await getCsrfToken();
  }

  let res = await doFetch(csrf);
  let json = (await safeJson<T>(res)) as ApiEnvelope<T>;

  // اگر csrf نامعتبر بود، یک بار توکن را تازه کن و دوباره تلاش کن
  if (mutating && !json.ok && json.code === "csrf_mismatch") {
    csrf = await getCsrfToken(true);
    res = await doFetch(csrf);
    json = (await safeJson<T>(res)) as ApiEnvelope<T>;
  }

  if (!json.ok) {
    throw new ApiError(json.message || "خطای ناشناخته", res.status, json.errors, json.code);
  }

  return json.data;
}

async function safeJson<T>(res: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    return {
      ok: false,
      message: `پاسخ نامعتبر از سرور (کد ${res.status})`,
      errors: null,
      code: "invalid_response",
    };
  }
}

interface EnvelopeWithMeta<T> {
  data: T;
  meta?: ApiEnvelopeSuccess<T>["meta"];
}

async function requestWithMeta<T>(path: string): Promise<EnvelopeWithMeta<T>> {
  const res = await fetch(apiUrl(path), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const json = (await safeJson<T>(res)) as ApiEnvelope<T>;
  if (!json.ok) {
    throw new ApiError(json.message || "خطای ناشناخته", res.status, json.errors, json.code);
  }
  return { data: json.data, meta: json.meta };
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  getWithMeta: <T>(path: string) => requestWithMeta<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body, mutating: true }),
  postForm: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData, isFormData: true, mutating: true }),
  // مخصوص create عمومی که نیازی به سشن ادمین ندارد اما CSRF لازم دارد
  postPublic: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body, mutating: true }),
  ensureCsrf: () => getCsrfToken(),
};
