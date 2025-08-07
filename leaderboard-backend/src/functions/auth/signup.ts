import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const { name, username, email, password } = JSON.parse(event.body ?? "{}");

    if (!name || !username || !email || !password) {
      return failure("Missing required fields", 400);
    }

    const result = await cognito.signUp(name, username, email, password);

    return success(
      {
        message:
          "Sign-up successful. Please check your e-mail for the confirmation code.",
        userSub: result.UserSub,
      },
      201
    );
  } catch (err) {
    return failure(err);
  }
};
