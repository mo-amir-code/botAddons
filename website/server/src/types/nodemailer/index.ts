interface SendMailType {
    to: [string];
    subject: string;
    html: string;
}


interface MailTemplateType {
    name: string;
    otp: number;
    message: string;
    link?: string;
    expireTime: number;
  }
  

export type { SendMailType, MailTemplateType };
