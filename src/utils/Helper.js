/**
 *
 * check is the token is literal or not
 */

const _isLiteral = (tokenType) => {
  return ["NUMBER", "STRING", "true", "false", "null"].includes(tokenType);
};

/**
 *
 * whether the token is an assignment operator.
 */
const _isAssignmentOperator = (tokenType) => {
  return tokenType === "SIMPLE_ASSIGN" || tokenType === "COMPLEX_ASSIGN";
};

/**
 *
 * Extra check whether it's valid assignment target.
 */

const _checkValidAssignmentTarget = (node, mode) => {
  if (node.type === "Identifier" || node.type === "MemberExpression" || mode) {
    return node;
  }
  throw new SyntaxError("Invalide Left-hand side in assignment expression");
};

module.exports = {
  _isLiteral: _isLiteral,
  _isAssignmentOperator: _isAssignmentOperator,
  _checkValidAssignmentTarget: _checkValidAssignmentTarget,
};
