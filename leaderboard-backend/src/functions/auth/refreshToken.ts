import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { refreshToken } = JSON.parse(event.body ?? "{}");

    if (!refreshToken) {
      return failure("Missing refresh token", 400);
    }

    const result = await cognito.refreshToken(refreshToken);
    return success({
      idToken: result.AuthenticationResult?.IdToken,
      accessToken: result.AuthenticationResult?.AccessToken,
      expiresIn: result.AuthenticationResult?.ExpiresIn,
      tokenType: result.AuthenticationResult?.TokenType,
    });
  } catch (err) {
    return failure(err, 401);
  }
};
