export type VerifyProps = {
  verifyEmail: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      bio?: string;
      coverphoto?: string;
      username?: string;
    };
    token: string;
  }
}

export type ForgotPasswordProps = {
  forgotPassword: {
    message: string;
  }
}

export type ResetPasswordProps = {
  resetPassword: {
    message: string;
  }
}