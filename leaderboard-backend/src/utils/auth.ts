export interface TokenResult {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Extracts and validates the access token from the request
 * @param event - The Lambda event object
 * @returns TokenResult with success status and token or error message
 */
export function extractAccessToken(event: any): TokenResult {
  // Try multiple ways to get the access token
  let accessToken: string | undefined;

  // Check Authorization header (lowercase - most common with HTTP APIs)
  if (event.headers?.authorization) {
    accessToken = event.headers.authorization.replace("Bearer ", "");
  }
  // Check Authorization header (uppercase - for compatibility)
  else if (event.headers?.Authorization) {
    accessToken = event.headers.Authorization.replace("Bearer ", "");
  }
  // Check query parameters
  else if (event.queryStringParameters?.accessToken) {
    accessToken = event.queryStringParameters.accessToken;
  }
  // Check body for POST requests
  else if (event.body) {
    try {
      const body = JSON.parse(event.body);
      accessToken = body.accessToken;
    } catch (e) {
      // Body is not JSON, ignore
    }
  }

  if (!accessToken) {
    return {
      success: false,
      error:
        "Missing access token. Please provide it in the Authorization header as 'Bearer <token>' or as 'accessToken' query parameter.",
    };
  }

  return {
    success: true,
    token: accessToken,
  };
}
