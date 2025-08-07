declare module "aws-lambda" {
  export interface APIGatewayProxyEvent {
    body: string | null;
    headers?: Record<string, string | undefined>;
    [key: string]: any;
  }

  export interface APIGatewayProxyResult {
    statusCode: number;
    headers?: Record<string, string>;
    body?: string;
  }

  export type APIGatewayProxyHandler = (
    event: APIGatewayProxyEvent
  ) => Promise<APIGatewayProxyResult>;
}
