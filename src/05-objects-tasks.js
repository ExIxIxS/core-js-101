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

  this.getArea = () => this.width * this.height;
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

  elementStr: '',
  idStr: '',
  classesStr: '',
  attrStr: '',
  pseudoClassesStr: '',
  pseudoElementStr: '',
  partsOrder: [],

  propLib: {
    element: 'elementStr',
    id: 'idStr',
    class: 'classesStr',
    attr: 'attrStr',
    pseudoClass: 'pseudoClassesStr',
    pseudoElement: 'pseudoElementStr',
  },
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

  buildNewObj() {
    const newObj = Object.create(this, {
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
      partsOrder: {
        value: [], enumerable: true, writable: true, configurable: true,
      },
    });
    return newObj;
  },

  processElement(partValue, partName) {
    let currentValue;

    switch (partName) {
      case 'element':
        currentValue = partValue;
        break;
      case 'id':
        currentValue = `#${partValue}`;
        break;
      case 'class':
        currentValue = `${this.classesStr}.${partValue}`;
        break;
      case 'attr': {
        const currentAttr = this.attrStr.slice(1, -1);
        const [key, value] = partValue.split('=');
        const attrObj = { [key]: value };
        const attrArr = Object.entries(attrObj)
          .map(([keyAttr, valueAttr]) => `${keyAttr}=${valueAttr}`);

        currentValue = (currentAttr)
          ? `[${currentAttr} ${attrArr.join(' ')}]`
          : `[${attrArr.join(' ')}]`;
        break;
      }
      case 'pseudoClass':
        currentValue = `${this.pseudoClassesStr}:${partValue}`;
        break;
      case 'pseudoElement':
        currentValue = `${this.pseudoElementStr}::${partValue}`;
        break;
      default:
        break;
    }

    const propName = this.propLib[partName];
    this[propName] = `${currentValue}`;
    this.addPartToOrder(partName);
    this.checkElemOrder();
  },

  element(value) {
    if (this.elementStr) {
      throw new Error(this.occurExeption);
    }

    const currentObj = (this.stringify()) ? this : this.buildNewObj();
    this.processElement.call(currentObj, value, 'element');

    return currentObj;
  },

  id(value) {
    if (this.idStr) {
      throw new Error(this.occurExeption);
    }

    const currentObj = (this.stringify()) ? this : this.buildNewObj();
    this.processElement.call(currentObj, value, 'id');

    return currentObj;
  },

  class(value) {
    const currentObj = (this.stringify()) ? this : this.buildNewObj();
    this.processElement.call(currentObj, value, 'class');

    return currentObj;
  },

  attr(attribute) {
    const currentObj = (this.stringify()) ? this : this.buildNewObj();
    this.processElement.call(currentObj, attribute, 'attr');

    return currentObj;
  },

  pseudoClass(value) {
    const currentObj = (this.stringify()) ? this : this.buildNewObj();
    this.processElement.call(currentObj, value, 'pseudoClass');

    return currentObj;
  },

  pseudoElement(value) {
    if (this.pseudoElementStr) {
      throw new Error(this.occurExeption);
    }

    const currentObj = (this.stringify()) ? this : this.buildNewObj();
    this.processElement.call(currentObj, value, 'pseudoElement');

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
