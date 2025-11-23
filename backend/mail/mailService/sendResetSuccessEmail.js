import { transporter } from "../mailerConfig.js";

export const sendResetSuccessEmail = async (email, userName) => {
    console.log('📧 sendResetSuccessEmail called with:', { email, userName });

    // Validate inputs first
    if (!email) {
        console.error(' No email provided to sendResetSuccessEmail');
        throw new Error("Email address is required");
    }

    // Check transporter
    if (!transporter) {
        console.error(' Transporter is null/undefined');
        throw new Error("Email transporter not configured");
    }

    console.log('🔍 Environment check:', {
        MAIL_USER: process.env.MAIL_USER ? 'SET' : 'NOT SET',
        MAIL_PASS: process.env.MAIL_PASS ? 'SET' : 'NOT SET'
    });

    const mailOptions = {
        from: `ASTO <${process.env.MAIL_USER}>`,
        to: email,
        subject: " Password Reset Successful",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .success-icon { font-size: 64px; text-align: center; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .alert { color: #856404; background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Password Reset Successful</h1>
                    </div>
                    <div class="content">
                        <div class="success-icon">🎉</div>
                        <h2>Hello ${userName || 'there'}!</h2>
                        <p>Great news! Your password has been successfully changed.</p>
                        <p>Your account is now secure with your new password.</p>
                        
                        <div class="alert">
                            <strong>⚠️ Important:</strong> If you didn't make this change, please contact our support team immediately at support@yourapp.com
                        </div>
                        
                        <p>For your security, here are some tips:</p>
                        <ul>
                            <li>Keep your password private and secure</li>
                            <li>Use a unique password for our platform</li>
                            <li>Consider enabling two-factor authentication</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your App Name Security Team</p>
                        <p>Need help? Contact us at support@yourapp.com</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hello ${userName || 'there'}!\n\nYour password has been successfully changed.\n\nIf you didn't do this, please contact support immediately at support@yourapp.com\n\n– Your App Security Team`
    };

    console.log('📧 Mail options prepared:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasHtml: !!mailOptions.html,
        hasText: !!mailOptions.text
    });

    try {
        console.log('📧 Attempting to send email...');
        const result = await transporter.sendMail(mailOptions);
        console.log(` Password reset success email sent to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(" DETAILED EMAIL ERROR:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        throw new Error(`Failed to send password reset success email: ${error.message}`);
    }
};