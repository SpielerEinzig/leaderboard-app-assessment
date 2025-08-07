import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { email, password } = JSON.parse(event.body ?? "{}");

    if (!email || !password) {
      return failure("Missing username or password", 400);
    }

    const result = await cognito.login(email, password);
    return success({
      idToken: result.AuthenticationResult?.IdToken,
      accessToken: result.AuthenticationResult?.AccessToken,
      refreshToken: result.AuthenticationResult?.RefreshToken,
      expiresIn: result.AuthenticationResult?.ExpiresIn,
      tokenType: result.AuthenticationResult?.TokenType,
    });
  } catch (err) {
    return failure(err, 401);
  }
};
