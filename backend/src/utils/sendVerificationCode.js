import { generateVerificationEmailCodeTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode,email,res ) {
    try {
        const massage = generateVerificationEmailCodeTemplate(verificationCode);
        sendEmail({
            email,
            subject: 'Your Verification Code (SVPC Library)',
            message: massage
        })
       



    } catch (error) {
        return res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again later.'

    })
}
}