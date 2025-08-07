/**
 * NOTE: If your project does not already include `@types/node`, install it to avoid
 * TypeScript complaints about the global `process` variable:
 *     npm i -D @types/node
 */
declare const process: { env: Record<string, string | undefined> };

import { createHmac } from "crypto";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandOutput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandOutput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  ForgotPasswordCommand,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  ChangePasswordCommand,
  ChangePasswordCommandOutput,
  GetUserCommand,
  GetUserCommandOutput,
  UpdateUserAttributesCommand,
  UpdateUserAttributesCommandOutput,
  DeleteUserCommand,
  DeleteUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

/**
 * CognitoService acts as a thin wrapper around AWS Cognito User Pools, exposing the
 * operations most commonly required by the application. All methods throw if the
 * underlying AWS SDK call fails – callers should wrap usages in try / catch when
 * they need to handle specific errors.
 *
 * Environment variables that MUST be provided (see `env.example.txt`):
 *   - COGNITO_USER_POOL_ID  → Cognito User Pool Id (e.g. us-east-1_123456789)
 *   - COGNITO_CLIENT_ID     → Cognito App Client Id
 *   - COGNITO_CLIENT_SECRET → (Optional) Client Secret, if the app client uses one
 *   - AWS_REGION            → AWS region where the user pool lives (e.g. us-east-1)
 */
export class CognitoService {
  private readonly client: CognitoIdentityProviderClient;
  //   private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret?: string;

  constructor() {
    // const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const region = process.env.AWS_REGION;

    // if (!userPoolId)
    //   throw new Error("COGNITO_USER_POOL_ID environment variable not set");
    if (!clientId)
      throw new Error("COGNITO_CLIENT_ID environment variable not set");
    if (!region) throw new Error("AWS_REGION environment variable not set");

    // this.userPoolId = userPoolId;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.client = new CognitoIdentityProviderClient({ region });
  }

  /**
   * Compute the Cognito SecretHash if this service was configured with a client secret.
   */
  private secretHash(username: string): string | undefined {
    if (!this.clientSecret) return undefined;
    const hmac = createHmac("sha256", this.clientSecret);
    hmac.update(username + this.clientId);
    return hmac.digest("base64");
  }

  /**
   * Register a new user in the Cognito User Pool.
   * @param name       The user's display name
   * @param username   A unique username (this will become the Cognito `Username`)
   * @param email      The user's e-mail address
   * @param password   The password the user chose
   * @param attributes Optional map of additional attributes (will be merged)
   */
  async signUp(
    name: string,
    username: string,
    email: string,
    password: string,
    attributes: Record<string, string> = {}
  ): Promise<SignUpCommandOutput> {
    const userAttributes = [
      { Name: "name", Value: name },
      // Store the caller-supplied username as the standard preferred_username attribute.
      { Name: "preferred_username", Value: username },
      { Name: "email", Value: email },
      ...Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
    ];

    const signUpParams: any = {
      ClientId: this.clientId,
      // The pool is configured for email-based sign-in, so the primary Username **must** be the e-mail.
      Username: email,
      Password: password,
      UserAttributes: userAttributes,
    };
    // SecretHash must be calculated with the same "Username" value we pass to Cognito.
    const hash = this.secretHash(email);
    if (hash) signUpParams.SecretHash = hash;

    const cmd = new SignUpCommand(signUpParams);
    return this.client.send(cmd);
  }

  /**
   * Resend a confirmation code to the user who has signed up but not yet confirmed.
   */
  async resendConfirmationCode(
    username: string
  ): Promise<ResendConfirmationCodeCommandOutput> {
    const resendParams: any = {
      ClientId: this.clientId,
      Username: username,
    };
    const hash = this.secretHash(username);
    if (hash) resendParams.SecretHash = hash;

    const cmd = new ResendConfirmationCodeCommand(resendParams);
    return this.client.send(cmd);
  }

  /**
   * Confirm a user's sign-up with the code they received by email / SMS.
   */
  async confirmSignUp(
    username: string,
    confirmationCode: string
  ): Promise<ConfirmSignUpCommandOutput> {
    const confirmParams: any = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    };
    const hash = this.secretHash(username);
    if (hash) confirmParams.SecretHash = hash;

    const cmd = new ConfirmSignUpCommand(confirmParams);
    return this.client.send(cmd);
  }

  /**
   * Authenticate a user with a USER_PASSWORD_AUTH flow.
   */
  async login(
    username: string,
    password: string
  ): Promise<InitiateAuthCommandOutput> {
    const authParams: Record<string, string> = {
      USERNAME: username,
      PASSWORD: password,
    };
    const hash = this.secretHash(username);
    if (hash) authParams.SECRET_HASH = hash;

    const cmd = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: authParams,
    });
    return this.client.send(cmd);
  }

  /**
   * Exchange a refresh token for new ID / access tokens.
   */
  async refreshToken(
    refreshToken: string,
    username?: string
  ): Promise<InitiateAuthCommandOutput> {
    const authParams: Record<string, string> = {
      REFRESH_TOKEN: refreshToken,
    };
    // Compute SECRET_HASH using the original username (email) but **do not** send USERNAME as an auth parameter.
    if (this.clientSecret && username) {
      const hash = this.secretHash(username);
      if (hash) authParams.SECRET_HASH = hash;
    }

    const cmd = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: this.clientId,
      AuthParameters: authParams,
    });
    return this.client.send(cmd);
  }

  /**
   * Triggers Cognito's ForgotPassword flow and sends a verification code to the user.
   */
  async sendForgotPassword(
    username: string
  ): Promise<ForgotPasswordCommandOutput> {
    const forgotParams: any = {
      ClientId: this.clientId,
      Username: username,
    };
    const hash = this.secretHash(username);
    if (hash) forgotParams.SecretHash = hash;

    const cmd = new ForgotPasswordCommand(forgotParams);
    return this.client.send(cmd);
  }

  /**
   * Completes the ForgotPassword flow by confirming the code and setting a new password.
   */
  async confirmForgotPassword(
    username: string,
    confirmationCode: string,
    newPassword: string
  ): Promise<ConfirmForgotPasswordCommandOutput> {
    const confirmFPParams: any = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    };
    const hash = this.secretHash(username);
    if (hash) confirmFPParams.SecretHash = hash;

    const cmd = new ConfirmForgotPasswordCommand(confirmFPParams);
    return this.client.send(cmd);
  }

  /**
   * Change the password for a signed-in user.
   */
  async changePassword(
    accessToken: string,
    previousPassword: string,
    proposedPassword: string
  ): Promise<ChangePasswordCommandOutput> {
    const cmd = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
    });
    return this.client.send(cmd);
  }

  /**
   * Retrieve the user's attributes using their access token.
   */
  async getUser(accessToken: string): Promise<GetUserCommandOutput> {
    const cmd = new GetUserCommand({ AccessToken: accessToken });
    return this.client.send(cmd);
  }

  /**
   * Update user attributes (e.g. name, preferred_username, etc.). Requires an access token.
   * Pass a simple key / value map of attributes to update.
   */
  async updateUserAttributes(
    accessToken: string,
    attributes: Record<string, string>
  ): Promise<UpdateUserAttributesCommandOutput> {
    const userAttributes = Object.entries(attributes).map(([Name, Value]) => ({
      Name,
      Value,
    }));

    const cmd = new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: userAttributes,
    });
    return this.client.send(cmd);
  }

  /**
   * Delete the currently signed-in user from the user pool.
   */
  async deleteUser(accessToken: string): Promise<DeleteUserCommandOutput> {
    const cmd = new DeleteUserCommand({ AccessToken: accessToken });
    return this.client.send(cmd);
  }
}
