import nodemailer from 'nodemailer';
import { SendMailType } from "../../types/nodemailer/index.js";
import { PROF_EMAIL, PROF_EMAIL_PASS } from '../../config/constants.js';


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: PROF_EMAIL as string, // your Gmail address
        pass: PROF_EMAIL_PASS as string // your Gmail password or App Password
    }
});



const sendMail = async ({ to, subject, html }: SendMailType): Promise<any> => {
    try {
        let mailOptions = {
            from:`<info@botAddons.com>`,
            to,
            subject,
            html
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

export {
    sendMail
}