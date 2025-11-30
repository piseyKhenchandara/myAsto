import { transporter } from "../mailerConfig.js"



export const sendVerificationEmail = async (email, verificationToken, userName) => {
    const mailOptions = {
        from : `Asto <${process.env.MAIL_USER}>`,
        to : email ,
        subject : '  Verify Your Email Address',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 10px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .code { 
                        background-color: #e8f5e8; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 32px; 
                        font-weight: bold; 
                        letter-spacing: 5px; 
                        margin: 25px 0;
                        border-radius: 8px;
                        border: 2px solid #4CAF50;
                    }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .warning { color: #ff6b6b; font-size: 14px; margin-top: 15px; padding: 10px; background-color: #ffe6e6; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Email Verification</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${userName || 'there'}! </h2>
                        <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
                        
                        <div class="code">${verificationToken}</div>
                        
                        <p><strong> This code will expire in 15 minutes.</strong></p>
                        
                        <div class="warning">
                            <strong>🛡️ Security Notice:</strong> If you didn't request this verification, please ignore this email.
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your App Name. All rights reserved.</p>
                        <p>Need help? Contact us at support@yourapp.com</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hello ${userName || 'there'}!\n\nYour verification code is: ${verificationToken}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log(` Verification email sent to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(' Failed to send verification email:', error);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
    
}


