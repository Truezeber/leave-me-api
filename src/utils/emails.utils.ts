import { Resend } from "resend";
import { config } from "../config/app.config";

const resend = new Resend(config.resendKey);

export const email = {
  sendPin: async (receiver: string, pin: string) => {
    const { data, error } = await resend.emails.send({
      from: 'donotreply@leavemeanote.site',
      to: [receiver],
      subject: "Leave Me a Note: Confirm your e-mail",
      html: `Hey! Here's your confirmation code: ${pin}`,
    });

    return { data, error };
  }
}
