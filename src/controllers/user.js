import { User } from "../models";

class UserController {
  async craete(req, res) {
    const user = new User({
      name: "Tiago",
      email: "tiago.tsa1@teste.com",
      password: "teste123",
      password_hast: "teste123",
      reset_password_token: "teste",
      reset_password_token_sent_at: new Date(),
      avatar_url: "teste-url",
    });

    await user.save();

    return res.json({ user });
  }
}

export default new UserController();
