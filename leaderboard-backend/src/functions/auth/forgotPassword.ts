import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { email } = JSON.parse(event.body ?? "{}");

    if (!email) {
      return failure("Missing email", 400);
    }

    await cognito.sendForgotPassword(email);
    return success({ message: "Password reset code sent successfully" });
  } catch (err) {
    return failure(err);
  }
};
