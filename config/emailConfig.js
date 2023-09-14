import nodemailer from "nodemailer";

class Email {
    constructor(receiverAddress, username, htmlTable) {
        this.transporter = nodemailer.createTransport({
            port: 1025,
        });

        this.mailOptions = {
            from: 'noreply@moneyorder.com',
            to: receiverAddress,
            subject: 'Transaction History',
            text: `Hi ${username}, This is your request transaction history.`,
            html: htmlTable
        };
    }

    sendMail() {
        this.transporter.sendMail(this.mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            return info.messageId;
        });
    }
}

export default Email;