const mongoose = require('mongoose');
const { isURL } = require('../utils/isURL');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: isURL,
      },
    },
    owner: {
      type: ObjectId,
      required: true,
    },
    likes: {
      type: [ObjectId],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // https://mongoosejs.com/docs/guide.html#versionKey
  },
);

module.exports = mongoose.model('card', cardSchema);
