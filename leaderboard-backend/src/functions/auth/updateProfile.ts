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

    // Get the attributes from the request body
    const { preferred_username, name } = JSON.parse(event.body ?? "{}");

    if (!preferred_username || !name) {
      return failure("Missing preferred_username or name", 400);
    }

    await cognito.updateUserAttributes(tokenResult.token!, {
      preferred_username: preferred_username,
      name: name,
    });
    return success({ message: "Profile updated successfully" });
  } catch (err) {
    return failure(err);
  }
};
