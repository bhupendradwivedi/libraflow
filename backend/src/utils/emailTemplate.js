export   const generateVerificationEmailCodeTemplate = (verificationCode) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <h2 style="color: #333;">Your Verification Code</h2>
        <p style="font-size: 16px; color: #555;">Use the following verification code to complete your registration:</p>
        <div style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${verificationCode}</div>
        <p style="font-size: 14px; color: #999;">This code will expire in 15 minutes. If you did not request this code, please ignore this email.</p>
    </div>
    `
}

export const generateForgetPasswordEmailTemplate = (resetUrl) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        
        
        <p>We received a request to reset your password.</p>
        
        <p>
            Click the button below to reset your password:
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Reset Password
            </a>
        </div>

        <p>This link will expire in <strong>15 minutes</strong>.</p>

        <p>If you did not request this, please ignore this email. Your account is secure.</p>

        <hr />

        <p style="font-size: 12px; color: #888;">
            If the button doesn’t work, copy and paste this URL into your browser:
            <br />
            ${resetUrl}
        </p>

        <p style="margin-top: 20px;">Regards,<br/>Support Team</p>
    </div>
    `;
};




