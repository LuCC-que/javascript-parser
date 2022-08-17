const { Parser } = require("../src/Parser");
const test = require("./utils/test");
const parser = new Parser();
const program = `
  //test
  /**
   * Documentation comment;
  */
  let x = 10;
  def func(x){
    x += 10;
    return x;
  }

  x;
`;

//------ast test
const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));

//------sex test
const sex = parser.parse(program, "s");
console.log(JSON.stringify(sex, null, 2));

const tests = [
  require("./AST_test/literals-test.js"),
  require("./AST_test/statement-list-test.js"),
  require("./AST_test/block-test.js"),
  require("./AST_test/empty-statement-test.js"),
  require("./AST_test/math-test.js"),
  require("./AST_test/assignment-test.js"),
  require("./AST_test/variable-test.js"),
  require("./AST_test/if-test.js"),
  require("./AST_test/relational-test.js"),
  require("./AST_test/equality-test.js"),
  require("./AST_test/logical-test.js"),
  require("./AST_test/unary-test.js"),
  require("./AST_test/while-test.js"),
  require("./AST_test/do-while-test.js"),
  require("./AST_test/for-test.js"),
  require("./AST_test/function-declaration-test.js"),
  // require("./AST_test/member-test.js"),
  // require("./AST_test/call-test.js"),
  // require("./AST_test/class-test.js"),
];

tests.forEach((testRun) => testRun(test));

console.log("All passed!!!");
