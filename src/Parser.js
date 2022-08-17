const { defaultFactory, SExpression } = require("./utils/Factory");
const { Tokenizer } = require("./utils/Tokenizer");
const {
  _isAssignmentOperator,
  _isLiteral,
  _checkValidAssignmentTarget,
} = require("./utils/Helper");
class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  /**
   * the parser
   */
  parse(string, mode) {
    this._string = string;
    this._tokenizer.init(string);
    this.mode = mode;
    this._factory = mode ? SExpression : defaultFactory;
    this._lookahead = this._tokenizer.getNextToken();
    return this.Program();
  }

  /**
   * Program
   *  : Literal
   */
  Program() {
    return this._factory.Program(this.StatementList());
  }

  /**
   * StatementList
   *  : Statement
   *  | StatementList Statement
   */

  StatementList(stop = null) {
    const statementList = [this.Statement()];
    while (this._lookahead != null && this._lookahead.type !== stop) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  /**
   * Statement
   *  : ExpressionStatement
   *  | BlockStatement
   *  | EmptyStatement
   *  | VariableStatement
   *  | IfStatement
   */

  Statement() {
    switch (this._lookahead.type) {
      case "{":
        return this.BlockStatement();
      case "if":
        return this.IfStatement();
      case ";":
        return this.EmptyStatement();
      case "let":
        return this.VariableStatement();
      case "def":
        return this.FunctionDeclaration();
      case "return":
        return this.ReturnStatement();
      case "while":
      case "do":
      case "for":
        return this.IterationStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * FunctionDeclaration
   *  : "def" Identifier '(' OptFormaParameterList ')' BlockStatement
   */
  FunctionDeclaration() {
    this._eat("def");
    const name = this.Identifier();

    this._eat("(");
    const params =
      this._lookahead.type !== ")" ? this.FormalParameterList() : [];
    this._eat(")");
    const body = this.BlockStatement();
    return this._factory.FunctionDeclaration(name, params, body);
  }

  /**
   * FormalParameterList
   *  : Identifier
   *  | FormalParameterList ',' Identifier
   */

  FormalParameterList() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this._lookahead.type === "," && this._eat(","));

    return params;
  }

  /**
   * ReturnStatement()
   *  : 'Return' OptExpression ';'
   */
  ReturnStatement() {
    this._eat("return");
    const argument = this._lookahead.type !== ";" ? this.Expression() : null;
    this._eat(";");

    return this._factory.ReturnStatement(argument);
  }

  /**
   * IterationStatement
   *  : WhileStatment
   *  | DoWhileStatement
   *  | ForStatement;
   */

  IterationStatement() {
    switch (this._lookahead.type) {
      case "while":
        return this.WhileStatement();
      case "do":
        return this.DoWhileStatement();
      case "for":
        return this.ForStatement();
    }
  }

  /**
   * WhileStatement()
   *  : 'while' '(' Expression ')' Statement
   */
  WhileStatement() {
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const body = this.Statement();

    return this._factory.WhileStatement(test, body);
  }

  /**
   * WhileStatement()
   *  : 'while' '(' Expression ')' Statement
   */
  DoWhileStatement() {
    this._eat("do");
    const body = this.Statement();
    this._eat("while");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    this._eat(";");

    return this._factory.DoWhileStatement(body, test);
  }

  /**
   * ForStatement()
   *  : 'for' '('init;test; update ')' body
   */
  ForStatement() {
    this._eat("for");
    this._eat("(");
    const init = this._lookahead.type !== ";" ? this.ForStatementInit() : null;
    this._eat(";");

    const test = this._lookahead.type !== ";" ? this.Expression() : null;
    this._eat(";");

    const update = this._lookahead.type !== ")" ? this.Expression() : null;
    this._eat(")");

    const body = this.Statement();

    return this._factory.ForStatement(init, test, update, body);
  }

  ForStatementInit() {
    if (this._lookahead.type === "let") {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  /**
   * IfStatement
   *  : 'if' '(' Expression ')' Statement
   *  | 'if' '(' Expression ')' Statement 'else' Statement
   */

  IfStatement() {
    this._eat("if");
    this._eat("(");
    const test = this.Expression();
    this._eat(")");
    const consequent = this.Statement();

    const alternate =
      this._lookahead != null && this._lookahead.type === "else"
        ? this._eat("else") && this.Statement()
        : null;
    return this._factory.IfStatement(test, consequent, alternate);
  }

  VariableStatementInit() {
    this._eat("let");
    const declarations = this.VariableDeclarationList();
    return this._factory.VariableStatement(declarations);
  }

  /**
   * VariableStatement
   *  : 'let' VariableDeclarationList ';'
   */

  VariableStatement() {
    const variableStatement = this.VariableStatementInit();
    this._eat(";");
    return variableStatement;
  }

  /**
   * VariableDeclarationList
   *  : VariableDeclaration
   *  | VariableDeclarationList ',' VariableDeclaration
   *  ;
   */

  VariableDeclarationList() {
    const declarations = [];
    do {
      let VariableDeclaration = this.VariableDeclaration();
      declarations.push(VariableDeclaration);
    } while (this._lookahead.type === "," && this._eat(","));
    return declarations;
  }
  /**
   * VariableDeclaration
   *  : Identifier OptVariableInitializer
   *  ;
   */
  VariableDeclaration() {
    const id = this.Identifier();

    //OptVarInitializer
    const init = [";", ","].includes(this._lookahead.type)
      ? null
      : this.VariableInitializer();

    return this._factory.VariableDeclaration(id, init);
  }

  /**
   * VariableInitializer
   *  : SIMPLE_ASSIGN AssignmentExpression
   *  ;
   */
  VariableInitializer() {
    this._eat("SIMPLE_ASSIGN");
    return this.AssignmentExpression();
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */

  EmptyStatement() {
    this._eat(";");
    return this._factory.EmptyStatement();
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   */

  BlockStatement() {
    this._eat("{");
    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];
    this._eat("}");

    return this._factory.BlockStatement(body);
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   */

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");
    return this._factory.ExpressionStatement(expression);
  }

  /**
   * Expression
   *  : AdditiveExpression ';'
   */

  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *  : LogicalORExpression
   *  | LeftHandSideExpression AssignmentOperator AssignmentExpression
   */
  AssignmentExpression() {
    const left = this.LogicalORExpression();

    if (!_isAssignmentOperator(this._lookahead.type)) {
      return left;
    }

    return this._factory.AssignmentExpression(
      this.AssignmentOperator().value,
      _checkValidAssignmentTarget(left, this.mode),
      this._lookahead.type != ";" ? this.AssignmentExpression() : null
    );
  }

  /**
   * Identifier
   *  : IDENTIFIER
   *  ;
   */

  Identifier() {
    const name = this._eat("IDENTIFIER").value;
    return this._factory.Identifier(name);
  }

  /**
   * AssignmentOperator
   *  : SIMPLE_ASSIGN
   *  | COMPLEX_ASSIGN
   */

  AssignmentOperator() {
    if (this._lookahead.type === "SIMPLE_ASSIGN") {
      return this._eat("SIMPLE_ASSIGN");
    }
    return this._eat("COMPLEX_ASSIGN");
  }

  /**
   * LogicalORExpression
   *  : LogicalANDExpression LOGICAL_OR LogicalORExpression
   *  | LogicalORExpression
   *  ;
   */

  LogicalORExpression() {
    return this._LogicalExpression("LogicalANDExpression", "LOGICAL_OR");
  }

  /**
   * LogicalORExpression
   *  : EqualityExpression LOGICAL_AND LogicalORExpression
   *  | EqualityExpression
   *  ;
   */

  LogicalANDExpression() {
    return this._LogicalExpression("EqualityExpression", "LOGICAL_AND");
  }

  /**
   * EqualityExpression
   *  : RelationalExpression EQUALITY_OPERATOR EqualityExpression
   *  | RelationalExpression
   *  ;
   */

  EqualityExpression() {
    return this._BinaryExpression("RelationalExpression", "EQUALITY_OPERATOR");
  }

  /**
   * RelationalExpression: >, >=, <, <=
   *  : AdditiveExpression
   *  | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
   *
   */

  RelationalExpression() {
    return this._BinaryExpression("AdditiveExpression", "RELATIONAL_OPERATOR");
  }

  /**
   * AdditiveExpression
   *  : Literal
   *  | AdditiveExpression ADDITIVE_OPERATOR Literal
   *  ;
   */

  AdditiveExpression() {
    return this._BinaryExpression(
      "MultiplicativeExpression",
      "ADDITIVE_OPERATOR"
    );
  }

  /**
   * MultiplicativeExpression
   *  : UnaryExpression
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR UnaryExpression
   *  ;
   */

  MultiplicativeExpression() {
    return this._BinaryExpression("UnaryExpression", "MULTIPLICATIVE_OPERATOR");
  }

  _LogicalExpression(BuilderName, operatorToken) {
    let left = this[BuilderName]();
    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken);
      const right = this[BuilderName]();
      left = this._factory.LogicalExpression(operator.value, left, right);
    }

    return left;
  }

  //helper function
  _BinaryExpression(BuilderName, operatorToken) {
    let left = this[BuilderName]();
    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken);
      const right = this[BuilderName]();
      left = this._factory.BinaryExpression(operator.value, left, right);
    }

    return left;
  }

  /**
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   */

  UnaryExpression() {
    let operator;
    switch (this._lookahead.type) {
      case "ADDITIVE_OPERATOR":
        operator = this._eat("ADDITIVE_OPERATOR").value;
        break;
      case "LOGICAL_NOT":
        operator = this._eat("LOGICAL_NOT").value;
        break;
    }

    if (operator != null) {
      return this._factory.UnaryExpression(operator, this.UnaryExpression());
    }

    return this.LeftHandSideExpression();
  }

  /**
   * LeftHandSideExpression
   *  : PrimayExpression
   *  ;
   */
  LeftHandSideExpression() {
    return this.PrimayExpression();
  }

  /**
   * PrimayExpression
   *  : Literal
   *  | ParenthesizedExpression
   */

  PrimayExpression() {
    if (_isLiteral(this._lookahead.type)) {
      return this.Literal();
    }
    switch (this._lookahead.type) {
      case "(":
        return this.ParenthesizedExpression();
      case "IDENTIFIER":
        return this.Identifier();
      default:
        return this.LeftHandSideExpression();
    }
  }

  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");

    return expression;
  }

  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   */

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      case "true":
        return this.BooleanLiteral(true);
      case "false":
        return this.BooleanLiteral(false);
      case "null":
        return this.NullLiteral(null);
    }

    throw new SyntaxError(
      `Literal: unexpected literal production ${this._lookahead.type}`
    );
  }

  /**
   * BooleanLiteral
   *  : 'true'
   *  | 'false'
   *  ;
   */

  BooleanLiteral(value) {
    this._eat(value ? "true" : "false");
    return this._factory.BooleanLiteral(value);
  }

  /**
   * NullLiteral
   *  : 'true'
   *  | 'false'
   *  ;
   */

  NullLiteral(value) {
    this._eat("null");
    return this._factory.NullLiteral(value);
  }

  /**
   * NumericLiteral
   *  : NUMBER
   */

  NumericLiteral() {
    const token = this._eat("NUMBER");
    return this._factory.NumericLiteral(Number(token.value));
  }

  /**
   * StringLiteral
   *  : String
   */

  StringLiteral() {
    const token = this._eat("STRING");
    return this._factory.StringLiteral(token.value.slice(1, -1));
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token "${token.value}", expected "${tokenType}"`
      );
    }
    //advance
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = { Parser };
