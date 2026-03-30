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
          
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
            dnsTimeout: 30000,
            tls: {
              
                rejectUnauthorized: false 
            }
        });

        const mailOptions = {
            from: `"SVPC Library" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: subject,
            html: message,
        };

        
        await transporter.verify(); 
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully:", info.messageId);
        return info;

    } catch (error) {
        console.error('Nodemailer Error Details:', error);
        throw new Error('Email delivery failed: ' + error.message);
    }
};