import { Base } from './base'
import { Extractor } from './add/extractor'
import { Validator } from './add/validator'

let counter = 0

function uniqueId () {
  return `${new Date().getTime()}${counter++}`
}

class Add extends Base {
  static create (trigger, cocooned) {
    const extractor = new Extractor(trigger)
    return new Add(trigger, cocooned, extractor.extract())
  }

  #item
  #options = {
    count: 1,
    // Other expected options:
    // builder: A Builder instance
    // method: Insertion method (one of: append, prepend, before, after, replaceWith)
    // node: Insertion Node as a DOM Element
  }

  constructor (trigger, cocooned, options = {}) {
    super(trigger, cocooned)

    this.#options = { ...this.#options, ...options }
    Validator.validates(this.#options)
  }

  handle (event) {
    for (let i = 0; i < this.#options.count; i++) {
      this.#item = this._build()
      if (!this._notify('before-insert', event)) {
        return false
      }

      this._insert()
      this._notify('after-insert', event)
    }
  }

  get _item () {
    return this.#item
  }

  get _notified () {
    return this.#options.node
  }

  _insert () {
    this.#options.node[this.#options.method](this._item)
  }

  _build () {
    return this.#options.builder.build(uniqueId()).firstElementChild
  }
}

export {
  Add
}
