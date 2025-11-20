import { type ZodSchema } from "zod";

interface NetworkError extends Error {
  name: "NetworkError";
}

interface ValidationError extends Error {
  name: "ValidationError";
  data?: unknown;
}

interface ApiError extends Error {
  name: "ApiError";
  status: number;
  data?: unknown;
}

export const createNetworkError = (message: string): NetworkError => {
  const error = new Error(message) as NetworkError;
  error.name = "NetworkError";
  return error;
};

export const createValidationError = (
  message: string,
  data?: unknown
): ValidationError => {
  const error = new Error(message) as ValidationError;
  error.name = "ValidationError";
  error.data = data;
  return error;
};

export const createApiError = (
  message: string,
  status: number,
  data?: unknown
): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = "ApiError";
  error.status = status;
  error.data = data;
  return error;
};

interface FetchJsonOptions extends RequestInit {
  schema?: ZodSchema;
}

export const fetchJson = async <T>(
  input: RequestInfo | URL,
  options?: FetchJsonOptions
): Promise<T> => {
  const { schema, ...init } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const combinedSignal = init?.signal
    ? AbortSignal.any([controller.signal, init.signal])
    : controller.signal;

  try {
    const response = await fetch(input, {
      ...init,
      signal: combinedSignal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();

    if (schema) {
      const result = schema.safeParse(data);
      if (!result.success) {
        throw createValidationError(
          "Response validation failed",
          result.error.format()
        );
      }
      return result.data as T;
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (
      error instanceof Error &&
      (error.name === "ApiError" || error.name === "ValidationError")
    ) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw createNetworkError("Request timeout");
      }
      throw createNetworkError(error.message);
    }

    throw createNetworkError("Unknown error occurred");
  }
};
