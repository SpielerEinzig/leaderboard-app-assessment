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

    // Get the old and new passwords from the request body
    const { oldPassword, newPassword } = JSON.parse(event.body ?? "{}");

    if (!oldPassword || !newPassword) {
      return failure("Missing old password or new password", 400);
    }

    await cognito.changePassword(tokenResult.token!, oldPassword, newPassword);
    return success({ message: "Password changed successfully" });
  } catch (err) {
    return failure(err);
  }
};
