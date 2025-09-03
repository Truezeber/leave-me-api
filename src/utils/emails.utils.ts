import { Resend } from "resend";
import { config } from "../config/app.config";
import { confirmPinEmail } from "./emails/confirmPin.email";

const resend = new Resend(config.resendKey);

export const email = {
  sendPin: async (receiver: string, pin: string) => {
    const { data, error } = await resend.emails.send({
      from: 'donotreply@leavemeanote.site',
      to: [receiver],
      subject: "Leave Me a Note: Confirm your e-mail",
      html: confirmPinEmail(receiver, pin),
    });

    return { data, error };
  }
}
