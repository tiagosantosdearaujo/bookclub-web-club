"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _models = require('../models');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class UserBookController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        book_id: Yup.number().required("Id do livro é obrigatório."),
      });

      await schema.validate(req.body);

      const user = await _models.User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const book = await _models.Book.findByPk(req.body.book_id);
      if (!book) {
        return res.status(404).json({ error: "Livro não encotrado" });
      }

      const alreadyExists = await _models.UserBook.findOne({
        where: {
          user_id: req.userId,
          book_id: req.body.book_id,
        },
      });

      if (alreadyExists) {
        return res.status(400).json({ error: "Livro já favoritado" });
      }

      const userbook = new (0, _models.UserBook)({
        user_id: req.userId,
        book_id: req.body.book_id,
      });

      await userbook.save();

      return res.json(userbook);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _ => _.message]) });
    }
  }

  async getAll(req, res) {
    try {
      const userbooks = await _models.UserBook.findAll({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: _models.Book,
            as: "book",
            include: [
              {
                model: _models.Author,
                as: "author",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      return res.json(userbooks);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _2 => _2.message]) });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Id do livro é obrigatório." });
      }

      const userbook = await _models.UserBook.findByPk(req.params.id);

      if (!userbook) {
        return res.status(404).json({ error: "Livro não encontado." });
      }

      if (userbook.user_id !== req.userId) {
        return res
          .status(401)
          .json({ error: "Registro não pertence ao usuário" });
      }

      await userbook.destroy();

      return res.json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _3 => _3.message]) });
    }
  }
}

exports. default = new UserBookController();
