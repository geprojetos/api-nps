import nodemailer, { TestAccount, Transporter } from "nodemailer";
import { compile } from "handlebars";
import { readFileSync } from "fs";

interface TemplateInfoProps {
  name: string;
  title: string;
  description: string;
}

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account: TestAccount) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err: Error) => {
        if (err) {
          console.error("Failed to create a testing account. " + err.message);
          return process.exit(1);
        }
      });
  }

  async execute(to: string, templateInfo: TemplateInfoProps, path: string) {
    const fileContent = readFileSync(path).toString("utf-8");
    const templateParse = compile(fileContent);
    const templateHtml = templateParse(templateInfo);
    if (!this.client) {
      return false;
    }
    const message = await this.client.sendMail({
      to,
      html: templateHtml,
      from: "NPS <noreplay@nps.com.br>",
    });

    const url = nodemailer.getTestMessageUrl(message);

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));

    return url;
  }
}

export { SendMailService };
