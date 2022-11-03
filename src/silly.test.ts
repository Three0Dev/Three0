/* eslint-disable no-undef */

const sillyFunction = require("./silly");

test("guaranteed random", () => {
  expect(sillyFunction()).toBe(4);
});
