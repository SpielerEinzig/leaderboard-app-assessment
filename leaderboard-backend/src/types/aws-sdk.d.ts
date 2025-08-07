declare module "@aws-sdk/client-apigatewaymanagementapi" {
  import { AwsCredentialIdentity, Provider } from "@aws-sdk/types";
  import { HttpHandlerOptions } from "@aws-sdk/types";

  export interface ApiGatewayManagementApiClientConfig {
    endpoint: string;
    region?: string;
    credentials?: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  }
  export class ApiGatewayManagementApiClient {
    constructor(config: ApiGatewayManagementApiClientConfig);
    send(command: any, options?: HttpHandlerOptions): Promise<any>;
  }
  export interface PostToConnectionCommandInput {
    ConnectionId: string;
    Data: Uint8Array | Buffer | string;
  }
  export class PostToConnectionCommand {
    constructor(input: PostToConnectionCommandInput);
  }
}
