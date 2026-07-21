export const verificationEmailTemplate = ({ code, expiresIn = '10 minutes' }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 600;">Verify Your Account</h1>
            </td>
          </tr>
          <tr>
            <td style="color: #4a4a4a; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 16px;">Thanks for signing up! Please enter the verification code below to verify your account:</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 16px 0 24px;">
              <div style="display: inline-block; background-color: #f8f9fa; border-radius: 8px; padding: 16px 32px; border: 1px solid #e1e4e8;">
                <span style="font-size: 32px; font-weight: 700; color: #1a1a2e; letter-spacing: 8px; font-family: 'SF Mono', 'Monaco', monospace;">${code}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="color: #6a6a6a; font-size: 14px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 12px;">This code will expire in <strong>${expiresIn}</strong>.</p>
              <p style="margin: 0;">If you didn't create an account, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="border-top: 1px solid #e1e4e8; padding-top: 20px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">If you have any questions, contact our support team.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-top: 20px; color: #999; font-size: 12px;">
        &copy; ${new Date().getFullYear()} My App. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const welcomeEmailTemplate = ({ name }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 600;">Welcome to My App! 🎉</h1>
            </td>
          </tr>
          <tr>
            <td style="color: #4a4a4a; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 16px;">Hi ${name},</p>
              <p style="margin: 0 0 16px;">Welcome aboard! Your account has been successfully verified. You can now access all features of our platform.</p>
              <p style="margin: 0;">If you have any questions, feel free to reach out to our support team.</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 16px;">
              <a href="${process.env.FRONTEND_URL || 'https://yourapp.com'}/dashboard" style="display: inline-block; background-color: #1a1a2e; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const forgotPasswordEmailTemplate = ({ resetLink, expiresIn = '1 hour' }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 600;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="color: #4a4a4a; font-size: 16px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 16px 0 24px;">
              <a href="${resetLink}" style="display: inline-block; background-color: #1a1a2e; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
            </td>
          </tr>
          <tr>
            <td style="color: #6a6a6a; font-size: 14px; line-height: 1.6; padding-bottom: 24px;">
              <p style="margin: 0 0 12px;">This link will expire in <strong>${expiresIn}</strong>.</p>
              <p style="margin: 0;">If you didn't request a password reset, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="border-top: 1px solid #e1e4e8; padding-top: 20px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">If you have any questions, contact our support team.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-top: 20px; color: #999; font-size: 12px;">
        &copy; ${new Date().getFullYear()} My App. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;