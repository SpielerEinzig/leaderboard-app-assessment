import { DynamoService } from "../../services/dynamo_service";
import { success, failure } from "../../utils/response";
import { extractAccessToken } from "../../utils/auth";

const dynamo = new DynamoService();

export const handler = async (event: any) => {
  try {
    // Extract and validate the access token
    const tokenResult = extractAccessToken(event);

    if (!tokenResult.success) {
      return failure(tokenResult.error!, 400);
    }

    const limit = parseInt(event.queryStringParameters?.limit || "10");

    const scores = await dynamo.getTopScores(limit);

    // Return only the highest score (first item in the sorted array)
    const topScore = scores.length > 0 ? scores[0] : null;

    return success(topScore);
  } catch (err) {
    return failure(err);
  }
};
