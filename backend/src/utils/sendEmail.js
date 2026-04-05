import nodeMailer from 'nodemailer';

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
          
            port: 587, 
          
            secure: false, 
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD, 
            },
           
            connectionTimeout: 10000,
            socketTimeout: 10000,
            tls: {
                // This helps bypass issues with Render's shared IP certificates
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            }
        });

        const mailOptions = {
            from: `"SVPC Library" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: subject,
            html: message,
        };

        // Standard verify check
        await transporter.verify(); 
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully:", info.messageId);
        return info;

    } catch (error) {
        console.error('Nodemailer Error Details:', error);
        throw new Error('Email delivery failed: ' + error.message);
    }
};