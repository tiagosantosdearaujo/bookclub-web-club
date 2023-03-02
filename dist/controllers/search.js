"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _models = require('../models');
var _sequelize = require('sequelize');

class SearchController {
  async get(req, res) {
    try {
      const { name } = req.query;
      const authors = await _models.Author.findAll({
        where: {
          name: {
            [_sequelize.Op.iLike]: `%${name}%`,
          },
        },
      });
      const books = await _models.Book.findAll({
        where: {
          name: {
            [_sequelize.Op.iLike]: `%${name}%`,
          },
        },
      });
      return res.json({ authors, books });
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _ => _.message]) });
    }
  }
}

exports. default = new SearchController();
