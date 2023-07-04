const { declare } = require('@babel/helper-plugin-utils')

module.exports = declare((api, options) => {
  api.assertVersion(7)
  const { types: t } = api

  return {
    name: 'babel-plugin-ot-ignore',

    visitor: {
      JSXElement (path, state) {
        const {
          otDataAttribute = 'data-ot-ignore',
          otClassName = 'optanon-category-C0001',
          srcValueRegex = false
        } = state.opts
        const { openingElement } = path.node

        function testSrcValueRegex (value) {
          if (!srcValueRegex) {
            return true
          }
          const regexp = new RegExp(srcValueRegex)
          return regexp.test(value)
        }

        const hasNoSrc = !openingElement.attributes?.some(
          (attr) =>
            attr.name?.name === 'src' && testSrcValueRegex(attr.value?.value)
        )
        if (hasNoSrc) {
          return
        }

        const alreadyHasOt = openingElement.attributes?.some(
          (attr) => attr.name?.name === otDataAttribute
        )

        if (otDataAttribute && !alreadyHasOt) {
          const additionalAttribute = t.jsxAttribute(
            t.jsxIdentifier(otDataAttribute),
            t.stringLiteral('')
          )
          openingElement.attributes.push(additionalAttribute)
        }

        if (!otClassName) {
          return
        }

        const hasNoOtherClasses = !openingElement.attributes?.some(
          (attr) => attr.name?.name === 'className'
        )

        if (hasNoOtherClasses) {
          const additionalAttribute = t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.stringLiteral(otClassName)
          )
          openingElement.attributes?.push(additionalAttribute)
          return
        }

        const existingClassAttribute = openingElement.attributes.find(
          (attr) => attr.name?.name === 'className'
        )

        // <img src="..." className />
        if (!existingClassAttribute.value) {
          existingClassAttribute.value = t.stringLiteral(otClassName)
          return
        }

        if (t.isJSXExpressionContainer(existingClassAttribute.value)) {
          const quasis = existingClassAttribute.value?.expression?.quasis
          if (!Array.isArray(quasis)) {
            existingClassAttribute.value = t.stringLiteral(otClassName)
            return
          }
          quasis.at(0).value.raw = [otClassName, quasis.at(0).value.raw].join(
            ' '
          )
          quasis.at(0).value.cooked = [
            otClassName,
            quasis.at(0).value.cooked
          ].join(' ')
          return
        }

        const existingClassAttributeValue = existingClassAttribute.value?.value
        const hasOptanonClass =
          existingClassAttributeValue?.includes(otClassName)
        if (hasOptanonClass) {
          return
        }

        const classes = existingClassAttributeValue.split(' ')
        classes.push(otClassName)
        existingClassAttribute.value.value = classes.join(' ').trim()
      }
    }
  }
})
