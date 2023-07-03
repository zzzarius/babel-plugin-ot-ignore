const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  api.assertVersion(7);
  const { types: t } = api;

  return {
    name: 'babel-plugin-ot-ignore',

    visitor: {
      JSXElement(path, state) {
        const {
          otDataAttribute = 'data-ot-ignore',
          otClassName = 'optanon-category-C0001',
          srcValueRegex = false,
        } = state.opts;
        const { openingElement } = path.node;

        function testSrcValueRegex(value) {
          if (!srcValueRegex) {
            return true;
          }
          return srcValueRegex.test(value);
        }

        const hasNoSrc =
          openingElement.attributes.findIndex(
            (attr) => attr.name && attr.name.name === 'src' && testSrcValueRegex(attr.value.value)
          ) === -1;
        if (hasNoSrc) {
          return;
        }

        const alreadyHasOt =
          openingElement.attributes.findIndex(
            (attr) => attr.name && attr.name.name === otDataAttribute
          ) !== -1;

        if (otDataAttribute && !alreadyHasOt) {
          const additionalAttribute = t.jsxAttribute(
            t.jsxIdentifier(otDataAttribute),
            t.stringLiteral('')
          );
          openingElement.attributes.push(additionalAttribute);
        }

        if (!otClassName) {
          return;
        }

        const hasNoOtherClasses =
          openingElement.attributes.findIndex(
            (attr) => attr.name && attr.name.name === 'className'
          ) === -1;

        if (hasNoOtherClasses) {
          const additionalAttribute = t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.stringLiteral(otClassName)
          );
          openingElement.attributes.push(additionalAttribute);
          return;
        }

        const existingClassAttribute = openingElement.attributes.find(
          (attr) => attr.name && attr.name.name === 'className'
        );

        // <imd src="..." className />
        if (!existingClassAttribute.value) {
          existingClassAttribute.value = t.stringLiteral(
            otClassName
          );
          return;
        }

        const existingClassAttributeValue = existingClassAttribute.value.value;
        const hasOptanonClass =
          existingClassAttributeValue.indexOf(otClassName) !== -1;
        if (hasOptanonClass) {
          return;
        }

        const classes = existingClassAttributeValue.split(' ');
        classes.push(otClassName);
        existingClassAttribute.value.value = classes.join(' ').trim();
      },
    },
  };
});
