# babel-plugin-ot-ignore
A Babel plugin that adds configurable `data-ot-ignore=''` and `className='optanon-category-C0001'`
to all React elements (script, img, iframe, embed...) which have `src` attribute.

## Installation
```sh
npm i babel-plugin-ot-ignore
```
Or
```sh
yarn add babel-plugin-ot-ignore
```

## Usage
Add to your `.babelrc` file:
```json
{
  "plugins": ["babel-plugin-ot-ignore"]
}
```

If you want to pass custom configuration options use `.babelrc.js`
```js

module.exports = function (api) {
  ...

  const plugins = [
    ...
    [
      'babel-plugin-ot-ignore',
      {
        otDataAttribute: "data-ot-ignore",
        otClassName: "optanon-category-C0001",
        srcValueRegex: /^https:\/\/yoursite.com/,
      },
    ],
    ...
  ];

  return {
    ...
    plugins,
    ...
  };
};
```


## Example
This jsx code:
```jsx
  const MyComponent = () => (
    <div>
      <img src="http://placekitten.com/200/300" />
    </div>
  );
```

Will be transformed to:
```jsx
  const MyComponent = () => (
    <div>
      <img src="http://placekitten.com/200/300" data-ot-ignore="" className="optanon-category-C0001" />
    </div>
  );
```
