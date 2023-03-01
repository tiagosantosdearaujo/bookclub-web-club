import { Author, Book } from "../models";
import * as Yup from "yup";

class AuthorController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Name is mandatory.")
          .min(3, "Name must be at least 6 characters.."),
        avatar_url: Yup.string().required("Avatar url is mandatory."),
        bio: Yup.string().required("Bio is mandatory"),
      });

      await schema.validate(req.body);

      const createdAuthor = await new Author({
        ...req.body,
      });

      await createdAuthor.save();

      return res.json({ createdAuthor });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async getAll(req, res) {
    try {
      const authors = await Author.findAll({
        order: [["name", "ASC"]],
      });

      return res.json(authors);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      console.log({ id });

      if (!id) {
        return res.status(400).json({ error: "Id Author is mandatory." });
      }

      const author = await Author.findByPk(Number(id), {
        include: [
          {
            model: Book,
            as: "book",
          },
        ],
      });

      if (!author) {
        return res.status(404).json({ error: "Author not found." });
      }

      return res.json(author);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
}

export default new AuthorController();
