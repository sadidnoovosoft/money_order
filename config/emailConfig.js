import nodemailer from "nodemailer";

class Email {
    constructor(receiverAddress, username, htmlTable) {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAILHOG_HOST,
            port: process.env.MAILHOG_SMTP_PORT
        });

        this.mailOptions = {
            from: 'noreply@moneyorder.com',
            to: receiverAddress,
            subject: 'Transaction History',
            text: `Hi ${username}, here is your requested transaction history.`,
            html: htmlTable
        };
    }

    async sendMail() {
        try {
            const info = await this.transporter.sendMail(this.mailOptions);
            return info.messageId;
        } catch (error) {
            console.log(error);
        }
    }
}

export default Email;