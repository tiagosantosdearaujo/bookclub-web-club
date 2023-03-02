"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _models = require('../models');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class AuthorController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Nome é obrigatório.")
          .min(3, "Nome deve conter mais de 3 caracteres."),
        avatar_url: Yup.string().required("Avatar url é obrigatório."),
        bio: Yup.string().required("Bio é obrigatória."),
      });

      await schema.validate(req.body);

      const createdAuthor = await new (0, _models.Author)({
        ...req.body,
      });

      await createdAuthor.save();

      return res.json({ createdAuthor });
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _ => _.message]) });
    }
  }

  async getAll(req, res) {
    try {
      const authors = await _models.Author.findAll({
        order: [["name", "ASC"]],
      });

      return res.json(authors);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _2 => _2.message]) });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      console.log({ id });

      if (!id) {
        return res.status(400).json({ error: "Id do autor é obrigatório." });
      }

      const author = await _models.Author.findByPk(Number(id), {
        include: [
          {
            model: _models.Book,
            as: "book",
          },
        ],
      });

      if (!author) {
        return res.status(404).json({ error: "Autor não encontrado." });
      }

      return res.json(author);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _3 => _3.message]) });
    }
  }
}

exports. default = new AuthorController();
