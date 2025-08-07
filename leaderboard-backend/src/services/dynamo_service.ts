import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

export interface ScoreItem {
  id: string;
  user_id: string;
  user_name: string;
  score: number;
  timestamp: number;
}

/**
 * Lightweight wrapper around DynamoDB that handles leaderboard score storage.
 */
export class DynamoService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const envTable = process.env.LEADERBOARD_TABLE;

    // If the env var is an ARN we can derive both region and table name from it.
    let regionFromArn: string | undefined;
    if (envTable?.startsWith("arn:")) {
      const parts = envTable.split(":"); // arn:aws:dynamodb:REGION:acct:table/name
      regionFromArn = parts[3];
    }

    // If the table ARN points to a *different* region, explicitly set it.
    // Otherwise let the SDK use the default provider chain (AWS_REGION from Lambda).
    const dynamoClient = regionFromArn
      ? new DynamoDBClient({ region: regionFromArn })
      : new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoClient);

    // Use resource name (after the last '/') when ARN supplied, otherwise env value or default.
    const derived = envTable ? envTable.split("/").pop() : undefined;
    this.tableName = derived || "leaderboard";
  }

  /**
   * Store a new score for an authenticated user.
   * @param userId The Cognito user sub
   * @param userName The user's preferred_username or email for display
   * @param score The numeric score achieved in the game
   */
  async submitScore(
    userId: string,
    userName: string,
    score: number
  ): Promise<ScoreItem> {
    const item: ScoreItem = {
      id: randomUUID(),
      user_id: userId,
      user_name: userName,
      score,
      timestamp: Date.now(),
    };

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return item;
  }

  /**
   * Get the highest score for a specific user (or null if none).
   */
  async getUserTopScore(userId: string): Promise<ScoreItem | null> {
    const scan = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "user_id = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        },
      })
    );
    const items = (scan.Items as ScoreItem[] | undefined) ?? [];
    if (items.length === 0) return null;
    items.sort((a, b) => b.score - a.score);
    return items[0];
  }

  /**
   * Fetch top N scores across all users, ordered descending.
   */
  async getTopScores(limit = 60): Promise<ScoreItem[]> {
    const scan = await this.client.send(
      new ScanCommand({ TableName: this.tableName })
    );
    const items = (scan.Items as ScoreItem[] | undefined) ?? [];
    items.sort((a, b) => b.score - a.score);
    return items.slice(0, limit);
  }
}
