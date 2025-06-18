const { transform: t } = require("@babel/core");
const otIgnore = require("../babel-plugin-ot-ignore");

const plainTransform = (code) =>
  t(code, {
    presets: ["@babel/preset-react"],
    configFile: false,
  }).code.trim();
describe("babel-plugin-ot-ignore defaults", () => {
  const transform = (code) =>
    t(code, {
      plugins: [otIgnore],
      presets: ["@babel/preset-react"],
      configFile: false,
    }).code.trim();

  test('Check if data attribute data-ot-ignore="" and class being added', () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" data-ot-ignore="" className="optanon-category-C0001" />
        </div>
      );
    `;

    expect(transform(input)).toBe(plainTransform(expectedOutput));
  });

  test("Check if className is appended to existing classes", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="existing-class" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="existing-class optanon-category-C0001" data-ot-ignore="" />
        </div>
      );
    `;

    expect(transform(input)).toBe(plainTransform(expectedOutput));
  });

  test("Check if className is appended to existing classes even with empty string", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="optanon-category-C0001" data-ot-ignore="" />
        </div>
      );
    `;

    expect(transform(input)).toBe(plainTransform(expectedOutput));
  });

  test("Check if className is appended to existing classes even if it`s empty", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="optanon-category-C0001" data-ot-ignore="" />
        </div>
      );
    `;

    expect(transform(input)).toBe(plainTransform(expectedOutput));
  });

  test("Check if className expressions are working", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="optanon-category-C0001" data-ot-ignore="" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" className="optanon-category-C0001" data-ot-ignore="" />
        </div>
      );
    `;

    expect(transform(input)).toBe(plainTransform(expectedOutput));
  });

  test("Check if className expressions are working", () => {
    const input = `
      const MyComponent = () => {
        const f = () => {}
        return (
          <div>
            <img src="http://placekitten.com/200/300" className={f()} />
          </div>
        )
      };
    `;

    const expectedOutput = `
      const MyComponent = () => {
        const f = () => {}
        return (
          <div>
            <img src="http://placekitten.com/200/300" className={f() + " optanon-category-C0001"} data-ot-ignore="" />
          </div>
        )
      };
    `;

    expect(transform(input)).toBe(plainTransform(expectedOutput));
  });
});

describe("babel-plugin-ot-ignore srcValueRegex", () => {
  const transformRegex = (code) =>
    t(code, {
      plugins: [
        [
          otIgnore,
          {
            srcValueRegex: /^http:\/\/placekitten.com/,
          },
        ],
      ],
      presets: ["@babel/preset-react"],
      configFile: false,
    }).code.trim();
  test("Should add ot attributes if regex matches", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" />
          <img src="http://example.com" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" data-ot-ignore="" className="optanon-category-C0001" />
          <img src="http://example.com" />
        </div>
      );
    `;

    expect(transformRegex(input)).toBe(plainTransform(expectedOutput));
  });
});

describe("babel-plugin-ot-ignore srcValueRegex as string", () => {
  const transformRegex = (code) =>
    t(code, {
      plugins: [
        [
          otIgnore,
          {
            srcValueRegex: "^http://placekitten.com",
          },
        ],
      ],
      presets: ["@babel/preset-react"],
      configFile: false,
    }).code.trim();
  test("Should add ot attributes if regex matches", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" />
          <img src="http://example.com" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" data-ot-ignore="" className="optanon-category-C0001" />
          <img src="http://example.com" />
        </div>
      );
    `;

    expect(transformRegex(input)).toBe(plainTransform(expectedOutput));
  });
});

describe("babel-plugin-ot-ignore otDataAttribute", () => {
  const transformDataAttribute = (code) =>
    t(code, {
      plugins: [
        [
          otIgnore,
          {
            otDataAttribute: "data-my-custom-attribute",
          },
        ],
      ],
      presets: ["@babel/preset-react"],
      configFile: false,
    }).code.trim();
  test("Custom otDataAttribute", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" />
          <img src="http://example.com" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" data-my-custom-attribute="" className="optanon-category-C0001" />
          <img src="http://example.com" data-my-custom-attribute="" className="optanon-category-C0001" />
        </div>
      );
    `;

    expect(transformDataAttribute(input)).toBe(plainTransform(expectedOutput));
  });
});

describe("babel-plugin-ot-ignore otClassName", () => {
  const transformClassName = (code) =>
    t(code, {
      plugins: [
        [
          otIgnore,
          {
            otClassName: "my-custom-class",
          },
        ],
      ],
      presets: ["@babel/preset-react"],
      configFile: false,
    }).code.trim();
  test("Custom class name", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" />
          <img src="http://example.com" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" data-ot-ignore="" className="my-custom-class" />
          <img src="http://example.com" data-ot-ignore="" className="my-custom-class" />
        </div>
      );
    `;

    expect(transformClassName(input)).toBe(plainTransform(expectedOutput));
  });
});

describe("babel-plugin-ot-ignore opt out adding class", () => {
  const transformClassName = (code) =>
    t(code, {
      plugins: [
        [
          otIgnore,
          {
            otClassName: false,
          },
        ],
      ],
      presets: ["@babel/preset-react"],
      configFile: false,
    }).code.trim();
  test("Should not add class if it`s disabled", () => {
    const input = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" />
          <img src="http://example.com" />
        </div>
      );
    `;

    const expectedOutput = `
      const MyComponent = () => (
        <div>
          <img src="http://placekitten.com/200/300" data-ot-ignore="" />
          <img src="http://example.com" data-ot-ignore="" />
        </div>
      );
    `;

    expect(transformClassName(input)).toBe(plainTransform(expectedOutput));
  });
});
