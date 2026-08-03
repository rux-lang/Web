import type { ApiFailure, ApiProblem, ApiValidationError } from "~/types/api";

const problemCodePattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const problemTypeBase = "https://api.rux-lang.dev/problems/";
const problemMediaType = "application/problem+json";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isValidationError(value: unknown): value is ApiValidationError {
  if (!isRecord(value)) return false;

  return (
    typeof value.code === "string" &&
    problemCodePattern.test(value.code) &&
    typeof value.detail === "string" &&
    value.detail.length > 0 &&
    isOptionalString(value.pointer) &&
    (value.pointer === undefined || value.pointer === "" || value.pointer.startsWith("/"))
  );
}

export function parseApiProblem(value: unknown): ApiProblem | null {
  if (!isRecord(value)) return null;

  const { type, title, status, code, detail, instance, errors } = value;
  if (typeof code !== "string" || !problemCodePattern.test(code)) return null;
  if (type !== `${problemTypeBase}${code}`) return null;
  if (typeof title !== "string" || title.length === 0) return null;
  if (!Number.isInteger(status) || (status as number) < 400 || (status as number) > 599) return null;
  if (!isOptionalString(detail) || !isOptionalString(instance)) return null;
  if (errors !== undefined && (!Array.isArray(errors) || errors.length === 0 || !errors.every(isValidationError))) {
    return null;
  }

  return {
    type,
    title,
    status: status as number,
    code,
    ...(detail === undefined ? {} : { detail }),
    ...(instance === undefined ? {} : { instance }),
    ...(errors === undefined ? {} : { errors }),
  };
}

function responseFrom(error: unknown): Record<string, unknown> | null {
  if (!isRecord(error) || !isRecord(error.response)) return null;
  return error.response;
}

function responseStatus(response: Record<string, unknown> | null): number | null {
  if (!response || !Number.isInteger(response.status)) return null;
  return response.status as number;
}

function responseContentType(response: Record<string, unknown> | null): string | null {
  if (!response || !isRecord(response.headers)) return null;
  const get = response.headers.get;
  if (typeof get !== "function") return null;
  const value = get.call(response.headers, "content-type");
  return typeof value === "string" ? value.toLowerCase() : null;
}

function responseData(error: unknown, response: Record<string, unknown> | null): unknown {
  if (isRecord(error) && "data" in error) return error.data;
  return response?._data;
}

export function normalizeApiError(error: unknown): ApiFailure {
  const response = responseFrom(error);
  const status = responseStatus(response);
  const contentType = responseContentType(response);
  const problem = contentType?.includes(problemMediaType) ? parseApiProblem(responseData(error, response)) : null;

  if (problem && problem.status === status) {
    return {
      title: problem.title,
      detail: problem.detail ?? "The request could not be completed.",
      errors: problem.errors?.map((item) => item.detail) ?? [],
      retryable: problem.status >= 500,
      problem,
    };
  }

  if (response === null) {
    return {
      title: "Unable to reach the registry",
      detail: "Check your connection and try again.",
      errors: [],
      retryable: true,
    };
  }

  return {
    title: "Something went wrong",
    detail: "The registry returned an unexpected response. Try again.",
    errors: [],
    retryable: status === null || status >= 500,
  };
}
