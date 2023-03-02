"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _models = require('../models');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class BookController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        category_id: Yup.number().required("Categoria é obrigatório"),
        author_id: Yup.number().required("Autor é obrigatório"),
        name: Yup.string().required(),
        cover_url: Yup.string().url("Cover deve ser uma URL válida."),
        release_date: Yup.date(
          "Data de lançamento deve ser um formato de data válido"
        ),
        pages: Yup.number(),
        synopsis: Yup.string(),
        highlighted: Yup.boolean(),
      });

      await schema.validate(req.body);

      const { category_id, author_id } = req.body;

      const category = await _models.Category.findByPk(category_id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      const author = await _models.Author.findByPk(author_id);

      if (!author) {
        return res.status(404).json({ error: "Autor não encontrada" });
      }

      const book = await new (0, _models.Book)({
        ...req.body,
      });

      await book.save();

      return res.json(book);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _ => _.message]) });
    }
  }

  async findAll(req, res) {
    const { highlighted, category_id } = req.query;
    try {
      const where = {};

      if (highlighted) {
        where.highlighted = highlighted;
      }

      if (category_id) {
        where.category_id = Number(category_id);
      }

      const books = await _models.Book.findAll({
        where,
        include: [
          {
            model: _models.Author,
            as: "author",
            attributes: ["name"],
          },
          {
            model: _models.Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      });
      return res.json(books);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _2 => _2.message]) });
    }
  }
}

exports. default = new BookController();
