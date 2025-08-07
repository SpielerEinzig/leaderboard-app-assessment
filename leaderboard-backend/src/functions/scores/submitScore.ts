import { DynamoService } from "../../services/dynamo_service";
import { CognitoService } from "../../services/cognito_service";
import { success, failure } from "../../utils/response";
import { extractAccessToken } from "../../utils/auth";

const dynamo = new DynamoService();
const cognito = new CognitoService();

export const handler = async (event: any) => {
  try {
    // Extract and validate the access token
    const tokenResult = extractAccessToken(event);

    if (!tokenResult.success) {
      return failure(tokenResult.error!, 400);
    }

    // Get the authenticated user's information
    const cognitoUser = await cognito.getUser(tokenResult.token!);

    // Extract user attributes
    const attrs: Record<string, string> = {};
    cognitoUser.UserAttributes?.forEach((attr) => {
      if (attr.Name && attr.Value) {
        attrs[attr.Name] = attr.Value;
      }
    });

    const userId = attrs.sub || cognitoUser.Username;
    const userName =
      attrs.preferred_username ||
      attrs.name ||
      attrs.email ||
      cognitoUser.Username;

    if (!userId || !userName) {
      return failure("Unable to determine user identity from token", 400);
    }

    // Get the score from the request body
    const { score } = JSON.parse(event.body ?? "{}");

    if (score === undefined || score === null) {
      return failure("Missing score", 400);
    }

    const result = await dynamo.submitScore(userId, userName, score);
    return success(result, 201);
  } catch (err) {
    return failure(err);
  }
};
