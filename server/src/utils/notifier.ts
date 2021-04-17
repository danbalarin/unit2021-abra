import { Config } from './config';
//import sgMail from '@sendgrid/mail';

export enum NotifyMessage {
  USER_ON_UNRESERVED_PLACE = "USER_ON_UNRESERVED_PLACE"
}

type NotifyMessagesData = {
  [key in keyof typeof NotifyMessage]: { 
    subject: string,
    message: string,
  }
}

const NOTIFY_MESSAGES: NotifyMessagesData = {
  USER_ON_UNRESERVED_PLACE: {
    subject: `Message from parking system!`,
    message: `Someone occupies place without reservation.`,
  },
}

export default class Notifier {
  private config: Config;

  constructor(options: { 
    config: Config 
  }) {
    Object.assign(this, options);
    //sgMail.setApiKey(this.config.notifications.sendgrid.apiKey);
  }

  async sendEmail(email: string, msgKey: NotifyMessage): Promise<void> {
    const apiKey = this.config.notifications.sendgrid.apiKey;
    if (!apiKey) {
      return;
    }

    console.log(`[SENDGRID] Sending msg ${msgKey}`);

    const msgData = NOTIFY_MESSAGES[msgKey];

    const msg = {
      to: email,
      from: this.config.notifications.sendgrid.emailFrom,
      subject: msgData.subject,
      text: msgData.message,
      html: `<strong style='font-family: "Comic Sans MS", "Comic Sans", cursive;>${msgData.message}</strong>`,
    };

    /*try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    }*/
  }
}