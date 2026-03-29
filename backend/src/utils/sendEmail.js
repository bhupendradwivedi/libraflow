import nodeMailer from 'nodemailer';

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD, 
            },

            connectionTimeout: 15000, 
            greetingTimeout: 15000,
            socketTimeout: 15000,
            tls: {
                rejectUnauthorized: false, 
            }
        });

        const mailOptions = {
            from: `"Library System" <${process.env.SMTP_MAIL}>`,
            to: email, 
            subject: subject,
            html: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully! ID:", info.messageId);
        return info;

    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        throw new Error('Email delivery failed: ' + error.message);
    }
};