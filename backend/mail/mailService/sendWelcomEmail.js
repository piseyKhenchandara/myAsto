
// sendWelcomeEmail.js
import { transporter } from '../mailerConfig.js';

export const sendWelcomeEmail = async (email, userName) => {
    const mailOptions = {
        from: `Asto <${process.env.MAIL_USER}>`,
        to: email,
        subject: "🎉 Welcome to Our Platform!",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .welcome-icon { font-size: 64px; text-align: center; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .feature-list { background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Welcome to Our Platform!</h1>
                    </div>
                    <div class="content">
                        <div class="welcome-icon">🚀</div>
                        <h2>Hello ${userName}! </h2>
                        <p>Welcome to our platform! Your email has been successfully verified and your account is ready to use.</p>
                        
                        <div class="feature-list">
                            <h3> What you can do now:</h3>
                            <ul>
                                <li> Access all platform features</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions, our support team is here to help you get started!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your App Name. All rights reserved.</p>
                        <p>Need help? Contact us at support@yourapp.com</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Welcome ${userName}!\n\nYour email has been successfully verified. You can now enjoy all the features of our application.\n\nIf you have any questions, feel free to contact our support team at support@yourapp.com`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log(` Welcome email sent to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(' Failed to send welcome email:', error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
    }
};