import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";

const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    const accessToken =
      event.headers?.Authorization?.replace("Bearer ", "") ||
      event.queryStringParameters?.accessToken;

    if (!accessToken) {
      return failure("Missing access token", 400);
    }

    await cognito.deleteUser(accessToken);
    return success({ message: "User deleted successfully" });
  } catch (err) {
    return failure(err);
  }
};
