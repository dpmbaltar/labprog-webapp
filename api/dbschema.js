const joi = require("joi")

module.exports = {

  /**
   * Esquema de validación de parámetros para agregar/actualizar pronóstico.
   */
  weatherSchema: joi.object({

    date: joi.date()
      .iso()
      .required(),

    temp: joi.number()
      .min(-273)
      .message('"temp" no puede ser menor que 273')
      .max(150)
      .message('"temp" no puede ser mayor que 150')
      .required(),

    condition: joi.string()
      .required(),

    icon: joi.string()
      .required(),
    
    precip: joi.number()
      .min(0)
      .message('"precip" no puede ser menor que 0')
      .max(100)
      .message('"precip" no puede ser mayor que 100')
      .required(),
    
    wind: joi.number()
      .min(0)
      .message('"wind" no puede ser menor que 0')
      .max(1000)
      .message('"wind" no puede ser mayor que 1000')
      .required(),

    windDir: joi.string()
      .uppercase()
      .required()

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
