const assert = require("assert");
const { Parser } = require("../../src/Parser");
let parser = new Parser();
module.exports = (program, expected) => {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
};
