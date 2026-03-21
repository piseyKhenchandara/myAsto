import { transporter } from "../mailerConfig.js";

export const sendPasswordResetEmail = async (email, reset_password_token, userName) => {
    const mailOptions = {
        from: `Asto <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF6B6B; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .code { 
                        background-color: #ffe8e8; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 32px; 
                        font-weight: bold; 
                        letter-spacing: 5px; 
                        margin: 25px 0;
                        border-radius: 8px;
                        border: 2px solid #FF6B6B;
                    }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .warning { color: #ff6b6b; font-size: 14px; margin-top: 15px; padding: 10px; background-color: #ffe6e6; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${userName || 'there'}!</h2>
                        <p>You requested to reset your password. Please use the code below:</p>
                        
                        <div class="code">${reset_password_token}</div>
                        
                        <p><strong>This code will expire in 30 minutes.</strong></p>
                        
                        <div class="warning">
                            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email.
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Asto Gear. All rights reserved.</p>
                        <p>Need help? Contact us at REDACTED_EMAIL</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hello ${userName || 'there'}!\n\nYour password reset code is: ${reset_password_token}\n\nThis code will expire in 30 minutes.\n\nIf you didn't request this, please ignore this email.`
    };
    
    try {
        const result = await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
};