import NodeMailJet from "node-mailjet";

const mailjet = NodeMailJet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

class Mail {
  async sendForgotPasswordMail(email, name, token) {
    try {
      const result = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "tiago.tsa1@hotmail.com",
              Name: "Forgot Password",
            },
            To: [
              {
                Email: email,
                Name: name,
              },
            ],
            TemplateID: 4619469,
            TemplateLanguage: true,
            Subject: "Reset Password",
            Variables: {
              name: name,
              token: token,
            },
          },
        ],
      });
      return result;
    } catch (error) {
      return { error };
    }
  }
}

export default new Mail();
