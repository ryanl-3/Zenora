import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

type SendArgs = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

export async function sendEmail({ to, subject, html, text, from }: SendArgs) {
  console.log("HTML being sent to SES:", html);
  const Destination = Array.isArray(to) ? { ToAddresses: to } : { ToAddresses: [to] };
  const Content = {
    Simple: {
      Subject: { Data: subject },
      Body: {
        Html: html ? { Data: html } : undefined,
        Text: text ? { Data: text } : undefined,
      },
    },
  };

  const command = new SendEmailCommand({
    FromEmailAddress: from ?? process.env.SES_FROM_ADDRESS!,
    Destination,
    Content,
  });

  await ses.send(command);
}