import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { email, code, newPassword } = JSON.parse(event.body ?? "{}");

    if (!email || !code || !newPassword) {
      return failure("Missing email, code, or new password", 400);
    }

    await cognito.confirmForgotPassword(email, code, newPassword);
    return success({ message: "Password reset successfully" });
  } catch (err) {
    return failure(err);
  }
};
