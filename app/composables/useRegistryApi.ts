export function useRegistryApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl.replace(/\/$/, "");

  return {
    absoluteUrl(path: string) {
      return new URL(path, `${baseURL}/`).toString();
    },
    get<T>(path: string, query?: Record<string, string | number>, signal?: AbortSignal) {
      return $fetch<T>(path, {
        baseURL,
        credentials: "omit",
        query,
        signal,
      });
    },
    sessionGet<T>(path: string, signal?: AbortSignal) {
      return $fetch<T>(path, {
        baseURL,
        credentials: "include",
        signal,
      });
    },
    sessionMutation<T>(
      path: string,
      method: "POST" | "PATCH" | "DELETE",
      csrfToken: string,
      body?: Record<string, unknown>,
      signal?: AbortSignal,
    ) {
      return $fetch<T>(path, {
        baseURL,
        method,
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        body,
        signal,
      });
    },
  };
}
