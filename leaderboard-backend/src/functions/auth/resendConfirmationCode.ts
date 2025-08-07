import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { username } = JSON.parse(event.body ?? "{}");

    if (!username) {
      return failure("Missing username", 400);
    }

    await cognito.resendConfirmationCode(username);
    return success({ message: "Confirmation code resent successfully" });
  } catch (err) {
    return failure(err);
  }
};
