const defaultFactory = {
  NumericLiteral(value) {
    return {
      type: "NumericLiteral",
      value,
    };
  },

  Program(body) {
    return {
      type: "Program",
      body,
    };
  },

  StringLiteral(value) {
    return {
      type: "StringLiteral",
      value,
    };
  },

  ExpressionStatement(expression) {
    return { type: "ExpressionStatement", expression };
  },

  BlockStatement(body) {
    return { type: "BlockStatement", body };
  },

  EmptyStatement() {
    return { type: "EmptyStatement" };
  },

  BinaryExpression(operator, left, right) {
    return { type: "BinaryExpression", operator, left, right };
  },

  AssignmentExpression(operator, left, right) {
    let answer = { type: "AssignmentExpression", operator, left };
    return right != null ? { ...answer, right } : answer;
  },

  Identifier(name) {
    return { type: "Identifier", name };
  },

  VariableStatement(declarations) {
    return { type: "VariableStatement", declarations };
  },

  VariableDeclaration(id, init) {
    return { type: "VariableDeclaration", id, init };
  },

  IfStatement(test, consequent, alternate) {
    return { type: "IfStatement", test, consequent, alternate };
  },

  BooleanLiteral(value) {
    return { type: "BooleanLiteral", value };
  },

  NullLiteral(value) {
    return { type: "NullLiteral", value };
  },

  LogicalExpression(operator, left, right) {
    return { type: "LogicalExpression", operator, left, right };
  },

  UnaryExpression(operator, argument) {
    return { type: "UnaryExpression", operator, argument };
  },

  WhileStatement(test, body) {
    return { type: "WhileStatement", test, body };
  },

  DoWhileStatement(body, test) {
    return { type: "DoWhileStatement", body, test };
  },

  ForStatement(init, test, update, body) {
    return { type: "ForStatement", init, test, update, body };
  },

  FunctionDeclaration(name, params, body) {
    return { type: "FunctionDeclaration", name, params, body };
  },

  ReturnStatement(argument) {
    return { type: "ReturnStatement", argument };
  },
};

const SExpression = {
  Program(body) {
    let answer = ["begin"];
    body.forEach((element) => {
      if (Array.isArray(element) && Array.isArray(element[0])) {
        answer.push(...element);
      } else {
        answer.push(element);
      }
    });
    return answer;
  },

  StringLiteral(value) {
    return `"${value}"`;
  },

  NumericLiteral(value) {
    return value;
  },

  ExpressionStatement(expression) {
    return expression;
  },

  BlockStatement(body) {
    return ["begin", ...body];
  },

  BinaryExpression(operator, left, right) {
    return [operator, left, right];
  },

  AssignmentExpression(operator, left, right) {
    if (operator == "=") operator = "set";

    return right == null ? [operator, left] : [operator, left, right];
  },

  Identifier(name) {
    return name;
  },

  VariableStatement(declarations) {
    return declarations;
  },

  VariableDeclaration(id, init) {
    return ["var", id, init];
  },

  IfStatement(test, consequent, alternate) {
    if (!Array.isArray(test)) {
      test = [test];
    }
    return alternate == null
      ? ["if", test, consequent]
      : ["if", test, consequent, alternate];
  },

  BooleanLiteral(value) {
    return `${value}`;
  },

  NullLiteral(value) {
    return `${value}`;
  },

  LogicalExpression(operator, left, right) {
    return [operator, left, right];
  },

  UnaryExpression(operator, argument) {
    return [operator, argument];
  },

  WhileStatement(test, body) {
    return ["while", test, body];
  },

  DoWhileStatement(body, test) {
    return ["do-while", body, test];
  },

  ForStatement(init, test, update, body) {
    if (Array.isArray(init) && Array.isArray(init[0])) {
      return ["for", ...init, test, update, body];
    }
    return ["for", init, test, update, body];
  },

  FunctionDeclaration(name, params, body) {
    return ["def", name, params, body];
  },

  ReturnStatement(argument) {
    return argument;
  },

  EmptyStatement() {},
};

module.exports = {
  defaultFactory,
  SExpression,
};
