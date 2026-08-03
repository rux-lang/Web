import { describe, expect, it } from "vitest";
import { normalizeApiError, parseApiProblem } from "../app/utils/api-problem";

const validationProblem = {
  type: "https://api.rux-lang.dev/problems/invalid_request",
  title: "The request is invalid",
  status: 422,
  code: "invalid_request",
  detail: "One or more fields are invalid.",
  instance: "/requests/example",
  errors: [
    {
      code: "invalid_name",
      detail: "The package name is invalid.",
      pointer: "/name",
    },
  ],
};

function fetchError(data: unknown, status: number, contentType = "application/problem+json") {
  return {
    data,
    response: {
      status,
      headers: new Headers({ "content-type": contentType }),
    },
  };
}

describe("parseApiProblem", () => {
  it("accepts the complete registry problem contract", () => {
    expect(parseApiProblem(validationProblem)).toEqual(validationProblem);
  });

  it("accepts a problem with required members only", () => {
    const problem = {
      type: "https://api.rux-lang.dev/problems/not_found",
      title: "Not Found",
      status: 404,
      code: "not_found",
    };

    expect(parseApiProblem(problem)).toEqual(problem);
  });

  it.each([
    {
      ...validationProblem,
      type: "https://example.com/problems/invalid_request",
    },
    { ...validationProblem, code: "InvalidRequest" },
    { ...validationProblem, status: 200 },
    { ...validationProblem, errors: [] },
    {
      ...validationProblem,
      errors: [{ code: "invalid_name", detail: "Invalid", pointer: "name" }],
    },
  ])("rejects malformed problem data", (problem) => {
    expect(parseApiProblem(problem)).toBeNull();
  });
});

describe("normalizeApiError", () => {
  it("presents server problem details without exposing machine fields", () => {
    const failure = normalizeApiError(fetchError(validationProblem, 422));

    expect(failure).toMatchObject({
      title: "The request is invalid",
      detail: "One or more fields are invalid.",
      errors: ["The package name is invalid."],
      retryable: false,
      problem: validationProblem,
    });
  });

  it("makes server failures retryable", () => {
    const problem = {
      type: "https://api.rux-lang.dev/problems/search_unavailable",
      title: "Search unavailable",
      status: 503,
      code: "search_unavailable",
    };

    expect(normalizeApiError(fetchError(problem, 503))).toMatchObject({
      title: "Search unavailable",
      detail: "The request could not be completed.",
      retryable: true,
    });
  });

  it("uses a safe network fallback", () => {
    const failure = normalizeApiError(new Error("connect ECONNREFUSED secret-host"));

    expect(failure).toEqual({
      title: "Unable to reach the registry",
      detail: "Check your connection and try again.",
      errors: [],
      retryable: true,
    });
    expect(JSON.stringify(failure)).not.toContain("secret-host");
  });

  it("uses a safe fallback for malformed and non-problem responses", () => {
    const failure = normalizeApiError(fetchError({ message: "database password leaked" }, 503, "application/json"));

    expect(failure).toEqual({
      title: "Something went wrong",
      detail: "The registry returned an unexpected response. Try again.",
      errors: [],
      retryable: true,
    });
    expect(JSON.stringify(failure)).not.toContain("database password");
  });

  it("rejects a problem body whose status does not match the response", () => {
    const failure = normalizeApiError(fetchError(validationProblem, 503));

    expect(failure).toEqual({
      title: "Something went wrong",
      detail: "The registry returned an unexpected response. Try again.",
      errors: [],
      retryable: true,
    });
  });
});
