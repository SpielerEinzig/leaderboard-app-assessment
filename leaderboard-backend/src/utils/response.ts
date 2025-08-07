export interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export function success(
  payload: unknown = {},
  statusCode = 200
): LambdaResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
}

export function failure(error: unknown, statusCode = 500): LambdaResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: error instanceof Error ? error.message : error,
    }),
  };
}
