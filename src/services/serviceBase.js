/**
 * @typedef {Service}
 */
export default class ServiceBase {
  /**
   * @param {*} options
   */
  constructor (options) {
    this.options = options
  }

  /**
   * @param {*} options
   */
  static build (options) {
    return new this(options)
  }
}