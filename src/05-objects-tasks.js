/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  // eslint-disable-next-line func-names
  this.getArea = function () {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const jsonObj = JSON.parse(json);
  Object.setPrototypeOf(jsonObj, proto);
  return jsonObj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  element(/* value */) {
    throw new Error('Not implemented');
  },

  id(/* value */) {
    throw new Error('Not implemented');
  },

  class(/* value */) {
    throw new Error('Not implemented');
  },

  attr(/* value */) {
    throw new Error('Not implemented');
  },

  pseudoClass(/* value */) {
    throw new Error('Not implemented');
  },

  pseudoElement(/* value */) {
    throw new Error('Not implemented');
  },

  combine(/* selector1, combinator, selector2 */) {
    throw new Error('Not implemented');
  },
};

/*
const cssSelectorBuilder = {
  elementStr: '',
  idStr: '',
  classesStr: '',
  attrStr: '',
  pseudoClassesStr: '',
  pseudoElementStr: '',
  occurExeption: 'Element, id and pseudo-element should
  not occur more then one time inside the selector',

  element(value) {
    if (!this.elementStr) {
      throw new Error(this.occurExeption);
    }

    if (!this.stringify()) {
      const newObj = Object.create(cssSelectorBuilder);
      newObj.elementStr = value;
      return newObj;
    }
    this.elementStr = value;
    return this;
  },

  id(value) {
    if (!this.idStr) {
      throw new Error(this.occurExeption);
    }
    if (!this.stringify()) {
      const newObj = Object.create(cssSelectorBuilder);
      newObj.idStr = `#${value}`;
      return newObj;
    }
    this.idStr = `#${value}`;
    return this;
  },

  class(value) {
    if (!this.stringify()) {
      const newObj = Object.create(cssSelectorBuilder);
      newObj.classesStr = `.${value}`;
      return newObj;
    }
    this.classesStr += `.${value}`;
    return this;
  },

  attr(attribute) {
    const currentAttr = this.attrStr.slice(1, -1);
    const [key, value] = attribute.split('=');
    const attrObj = {};
    attrObj[key] = value;
    const attrArr = Object.entries(attrObj)
    .map(([keyAttr, valueAttr]) => `${keyAttr}=${valueAttr}`);
    const attrStr = (currentAttr)
      ? `[${currentAttr} ${attrArr.join(' ')}]`
      : `[${attrArr.join(' ')}]`;
    if (!this.stringify()) {
      const newObj = Object.create(cssSelectorBuilder);
      newObj.attrStr = attrStr;
      return newObj;
    }
    this.attrStr = attrStr;
    return this;
  },

  pseudoClass(value) {
    if (!this.stringify()) {
      const newObj = Object.create(cssSelectorBuilder);
      newObj.pseudoClassesStr = `:${value}`;
      return newObj;
    }
    this.pseudoClassesStr += `:${value}`;
    return this;
  },

  pseudoElement(value) {
    if (!this.pseudoElementStr) {
      throw new Error(this.occurExeption);
    }
    if (!this.stringify()) {
      const newObj = Object.create(cssSelectorBuilder);
      newObj.pseudoElementStr = `::${value}`;
      return newObj;
    }
    this.pseudoElementStr += `::${value}`;
    return this;
  },

  combine(selector1, combinator, selector2) {
    const newObj = {
      combineStr: `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
      stringify() {
        return this.combineStr;
      },
    };
    return newObj;
  },

  stringify() {
    const str = `
${this.elementStr}
${this.idStr}
${this.classesStr}
${this.attrStr}
${this.pseudoClassesStr}
${this.pseudoElementStr}`;
    return str.replaceAll('\n', '');
  },
};
*/

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
