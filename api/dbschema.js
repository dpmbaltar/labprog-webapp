const joi = require("joi")

module.exports = {
  weatherSchema: joi.object({
    date: joi.date()
      .iso()
      //.format('YYYY-MM-DD')
      //.min(today())
      //.message('"date" cannot be earlier than today')
      //.max(tomorrow() + 10)
      //.message('"date" cannot be later than tomorrow +10')
      .required(),

    temp: joi.number()
      .min(-273)
      .message('"temp" cannot be minor to 273')
      .max(150)
      .message('"temp" cannot be mayor to 150')
      .required(),

  }).with('date', 'temp'),

  /**
   * Esquema de validación de parámetros para la obtención del pronóstico.
   */
  weatherParamsSchema: joi.object({
    
    /**
     * El primer día del pronóstico.
     */
    from: joi.number()
      .min(0)
      .message('El primer día "from" debe ser mayor o igual a cero')
      .required(),

    /**
     * Cantidad días del pronóstico desde el primero en adelante (máximo 10).
     */
    days: joi.number()
      .min(1)
      .message('La cantidad de días "days" debe ser mayor o igual a uno')
      .max(10)
      .message('La cantidad de días "days" debe ser menor o igual a diez')
      .required()

  }).with('from', 'days')
}
