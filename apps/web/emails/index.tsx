import { render } from "@react-email/render";
import { env } from "env/server.mjs";
import { createTransport } from "nodemailer";
import ContactFormularEmail, {
  type Props as ContactMailProps,
} from "./ContactFormularEmail";
import WelcomeMail from "./Welcome";
import InviteEmail, { type Props as InviteEmailProps } from "./invite";

const transporter = createTransport({
  pool: true,
  url: env.EMAIL_SERVER,
  from: `Abby <${env.ABBY_FROM_EMAIL}>`,
});

export function sendInviteEmail(props: InviteEmailProps) {
  const email = render(<InviteEmail {...props} />);

  return transporter.sendMail({
    to: props.invitee.email,
    from: `Abby <${env.ABBY_FROM_EMAIL}>`,
    subject: `Join ${props.inviter.name} on Abby`,
    html: email,
  });
}

export function sendContactFormularEmail(props: ContactMailProps) {
  const email = render(<ContactFormularEmail {...props} />);
  const abbyContactAdress = "tim@tryabby.com";
  return transporter.sendMail({
    to: abbyContactAdress,
    from: `Abby <${env.ABBY_FROM_EMAIL}>`,
    subject: `New Message from ${props.name} ${props.surname}`,
    html: email,
  });
}

export function sendWelcomeEmail(toEmail: string) {
  const email = render(<WelcomeMail />);
  return transporter.sendMail({
    to: toEmail,
    from: "Tim from A/BBY <tim@tryabby.com>",
    subject: "👋 Welcome to A/BBY!",
    html: email,
  });
}
