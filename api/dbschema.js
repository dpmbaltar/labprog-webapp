const joi = require("joi")

module.exports = joi.object({
  /*date: joi.date()
    //.format('YYYY-MM-DD')
    //.min(today())
    .message('"date" cannot be earlier than today')
    //.max(tomorrow() + 10)
    .message('"date" cannot be later than tomorrow +10')
    .required(),*/

  temp: joi.number()
    .min(-273)
    .message('"temp" cannot be minor to 273')
    .max(150)
    .message('"temp" cannot be mayor to 150')
    .required(),

}).with('date', 'temp')
