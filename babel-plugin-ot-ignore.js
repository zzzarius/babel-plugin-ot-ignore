const { declare } = require("@babel/helper-plugin-utils");

module.exports = declare((api) => {
  api.assertVersion(7);
  const { types: t } = api;

  return {
    name: "babel-plugin-ot-ignore",

    visitor: {
      JSXElement(path, state) {
        const {
          otDataAttribute = "data-ot-ignore",
          otClassName = "optanon-category-C0001",
          srcValueRegex = false,
        } = state.opts;
        const { openingElement } = path.node;

        function testSrcValueRegex(value) {
          if (!srcValueRegex) {
            return true;
          }
          const regexp = new RegExp(srcValueRegex);
          return regexp.test(value);
        }

        const hasNoSrc = !openingElement.attributes?.some(
          (attr) =>
            attr.name?.name === "src" && testSrcValueRegex(attr.value?.value),
        );
        if (hasNoSrc) {
          return;
        }

        const alreadyHasOt = openingElement.attributes?.some(
          (attr) => attr.name?.name === otDataAttribute,
        );

        if (otDataAttribute && !alreadyHasOt) {
          const additionalAttribute = t.jsxAttribute(
            t.jsxIdentifier(otDataAttribute),
            t.stringLiteral(""),
          );
          openingElement.attributes.push(additionalAttribute);
        }

        if (!otClassName) {
          return;
        }

        const classNameAttribute = openingElement.attributes?.findLast(
          (attr) => attr.name?.name === "className",
        );
        if (!classNameAttribute) {
          const additionalAttribute = t.jsxAttribute(
            t.jsxIdentifier("className"),
            t.stringLiteral(otClassName),
          );
          openingElement.attributes.push(additionalAttribute);
          return;
        }

        if (classNameAttribute.value === null) {
          classNameAttribute.value = t.stringLiteral(otClassName);
          return;
        }

        if (t.isStringLiteral(classNameAttribute.value)) {
          if (classNameAttribute.value.value.includes(otClassName)) {
            return;
          }
          classNameAttribute.value = t.stringLiteral(
            [classNameAttribute.value.value, otClassName]
              .filter(Boolean)
              .join(" "),
          );
          return;
        }

        if (t.isJSXExpressionContainer(classNameAttribute.value)) {
          const originalClassNameExpression =
            classNameAttribute.value.expression;
          const newClassNameExpression = t.binaryExpression(
            "+",
            originalClassNameExpression,
            t.stringLiteral(` ${otClassName}`),
          );
          classNameAttribute.value = t.jsxExpressionContainer(
            newClassNameExpression,
          );
        }
      },
    },
  };
});
