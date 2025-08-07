import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";
import { extractAccessToken } from "../../utils/auth";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    // Extract and validate the access token
    const tokenResult = extractAccessToken(event);

    if (!tokenResult.success) {
      return failure(tokenResult.error!, 400);
    }

    const cognitoUser = await cognito.getUser(tokenResult.token!);

    // Transform the Cognito response into the expected format
    const attrs: Record<string, string> = {};
    cognitoUser.UserAttributes?.forEach((attr) => {
      if (attr.Name && attr.Value) {
        attrs[attr.Name] = attr.Value;
      }
    });

    const user = {
      username: cognitoUser.Username,
      attributes: attrs,
    };

    return success(user);
  } catch (err) {
    return failure(err, 401);
  }
};
