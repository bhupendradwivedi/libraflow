import { generateVerificationEmailCodeTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email) {

    const message = generateVerificationEmailCodeTemplate(verificationCode);

    await sendEmail({
        email,
        subject: "Your Verification Code (SVPC Library)",
        message
    });

}
