import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { email, confirmationCode } = JSON.parse(event.body ?? "{}");

    if (!email || !confirmationCode) {
      return failure("Missing email or confirmation code", 400);
    }

    await cognito.confirmSignUp(email, confirmationCode);
    return success({ message: "User confirmed successfully" });
  } catch (err) {
    return failure(err);
  }
};
