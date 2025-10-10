import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, url: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: "UpcraftCrew <noreply@yourdomain.com>", // ← Alterar para seu domínio
			to: [email],
			subject: "Verify your email address",
			html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Welcome to UpcraftCrew!</h2>
              <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
              <a href="${url}" class="button">Verify Email Address</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${url}</p>
              <div class="footer">
                <p>If you didn't create an account, you can safely ignore this email.</p>
                <p>This link will expire in 24 hours.</p>
              </div>
            </div>
          </body>
        </html>
      `,
		});

		if (error) {
			console.error("Error sending verification email:", error);
			throw error;
		}

		return { success: true, data };
	} catch (error) {
		console.error("Failed to send verification email:", error);
		throw error;
	}
}

export async function sendPasswordResetEmail(email: string, url: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: "UpcraftCrew <noreply@yourdomain.com>",
			to: [email],
			subject: "Reset your password",
			html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #DC2626;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${url}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${url}</p>
              <div class="footer">
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
              </div>
            </div>
          </body>
        </html>
      `,
		});

		if (error) {
			console.error("Error sending password reset email:", error);
			throw error;
		}

		return { success: true, data };
	} catch (error) {
		console.error("Failed to send password reset email:", error);
		throw error;
	}
}
