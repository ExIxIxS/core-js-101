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
  constructor: {
    elementStr: {
      value: '', enumerable: true, writable: true, configurable: true,
    },
    idStr: {
      value: '', enumerable: true, writable: true, configurable: true,
    },
    classesStr: {
      value: '', enumerable: true, writable: true, configurable: true,
    },
    attrStr: {
      value: '', enumerable: true, writable: true, configurable: true,
    },
    pseudoClassesStr: {
      value: '', enumerable: true, writable: true, configurable: true,
    },
    pseudoElementStr: {
      value: '', enumerable: true, writable: true, configurable: true,
    },
  },

  elementStr: '',
  idStr: '',
  classesStr: '',
  attrStr: '',
  pseudoClassesStr: '',
  pseudoElementStr: '',
  partsOrder: [],

  correctOrder: ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'],
  occurExeption: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  rangeExeption: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  addPartToOrder(partName) {
    if (this.partsOrder && partName) {
      if (this.partsOrder.at(-1) !== partName) {
        this.partsOrder.push(partName);
      }
    }
    return this;
  },

  checkElemOrder() {
    const currentElement = this.partsOrder.at(-1);
    const currentArr = this.partsOrder.slice(0, -1);
    const sampleArr = this.correctOrder.slice(0, this.correctOrder.indexOf(currentElement));

    if (!currentArr.every((item) => sampleArr.includes(item))) {
      throw new Error(this.rangeExeption);
    }

    return this;
  },

  element(value) {
    if (this.elementStr) {
      throw new Error(this.occurExeption);
    }

    let currentObj = this;

    if (!this.stringify()) {
      const newObj = Object.create(this, { ...this.constructor });
      newObj.partsOrder = [];
      currentObj = newObj;
    }

    currentObj.elementStr = value;
    currentObj.addPartToOrder('element');
    currentObj.checkElemOrder();

    return currentObj;
  },

  id(value) {
    if (this.idStr) {
      throw new Error(this.occurExeption);
    }

    let currentObj = this;

    if (!this.stringify()) {
      const newObj = Object.create(this, { ...this.constructor });
      newObj.partsOrder = [];
      currentObj = newObj;
    }

    currentObj.idStr = `#${value}`;
    currentObj.addPartToOrder('id');
    currentObj.checkElemOrder();

    return currentObj;
  },

  class(value) {
    let currentObj = this;

    if (!this.stringify()) {
      const newObj = Object.create(this, { ...this.constructor });
      newObj.partsOrder = [];
      currentObj = newObj;
    }

    currentObj.classesStr += `.${value}`;
    currentObj.addPartToOrder('class');
    currentObj.checkElemOrder();

    return currentObj;
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

    let currentObj = this;

    if (!this.stringify()) {
      const newObj = Object.create(this, { ...this.constructor });
      newObj.partsOrder = [];
      currentObj = newObj;
    }

    currentObj.attrStr = attrStr;
    currentObj.addPartToOrder('attr');
    currentObj.checkElemOrder();

    return currentObj;
  },

  pseudoClass(value) {
    let currentObj = this;

    if (!this.stringify()) {
      const newObj = Object.create(this, { ...this.constructor });
      newObj.partsOrder = [];
      currentObj = newObj;
    }

    currentObj.pseudoClassesStr += `:${value}`;
    currentObj.addPartToOrder('pseudoClass');
    currentObj.checkElemOrder();

    return currentObj;
  },

  pseudoElement(value) {
    let currentObj = this;

    if (this.pseudoElementStr) {
      throw new Error(this.occurExeption);
    }

    if (!this.stringify()) {
      const newObj = Object.create(this, { ...this.constructor });
      newObj.partsOrder = [];
      currentObj = newObj;
    }

    currentObj.pseudoElementStr += `::${value}`;
    currentObj.addPartToOrder('pseudoElement');
    currentObj.checkElemOrder();

    return currentObj;
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

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
