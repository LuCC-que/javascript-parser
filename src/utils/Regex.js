const Spec = [
  /*------------------------
    empty case
   */
  [/^\s+/, null],

  /*------------------------
    NUMBER case
   */
  [/^\d+/, "NUMBER"],

  /*------------------------
    Singlie-line comments case
   */
  [/^\/\/.*/, null],

  /*------------------------
    double-line comments case
   */
  [/^\/\*[\s\S]*?\*\//, null],

  /*------------------------
    STRING case
   */
  [/^"[^"]*"/, "STRING"],

  /*------------------------
    STRING case
   */
  [/^'[^']*'/, "STRING"],

  //--------symbols---------
  /*------------------------
    ; case
   */
  [/^;/, ";"],
  /*------------------------
    { case
   */
  [/^\{/, "{"],
  /*------------------------
    } case
   */
  [/^\}/, "}"],
  /*------------------------
    ( case
   */
  [/^\(/, "("],
  /*------------------------
    ) case
   */
  [/^\)/, ")"],
  /*------------------------
     , case
   */
  [/^,/, ","],
  /*------------------------
     . case
   */
  [/^\./, "."],

  /*------------------------
     [ case
   */
  [/^\[/, "["],

  /*------------------------
     ] case
   */
  [/^\]/, "]"],

  /*------------------------
    Keywords
   */
  [/^\blet\b/, "let"],
  [/^\bif\b/, "if"],
  [/^\belse\b/, "else"],
  [/^\btrue\b/, "true"],
  [/^\bfalse\b/, "false"],
  [/^\bnull\b/, "null"],
  [/^\bwhile\b/, "while"],
  [/^\bdo\b/, "do"],
  [/^\bfor\b/, "for"],
  [/^\bdef\b/, "def"],
  [/^\breturn\b/, "return"],
  [/^\bclass\b/, "class"],
  [/^\bextends\b/, "extends"],
  [/^\bsuper\b/, "super"],
  [/^\bthis\b/, "this"],
  [/^\bnew\b/, "new"],

  /*------------------------
    Identifiers case
   */
  [/^\w+/, "IDENTIFIER"],

  /*------------------------
    Identifiers case
   */
  [/^[=!]=/, "EQUALITY_OPERATOR"],

  /*------------------------
    Assignment cases
    = += /= += -=
   */
  [/^\=/, "SIMPLE_ASSIGN"],
  [/^[\*\/\+\-]=/, "COMPLEX_ASSIGN"],
  [/^\+\+/, "COMPLEX_ASSIGN"],
  [/^\-\-/, "COMPLEX_ASSIGN"],

  /*------------------------
    Relational cases
    >, >=, <, <=
   */
  [/^[><]=?/, "RELATIONAL_OPERATOR"],
  /*------------------------
    Logical cases
    >, >=, <, <=
   */
  [/^&&/, "LOGICAL_AND"],
  [/^\|\|/, "LOGICAL_OR"],
  [/^!/, "LOGICAL_NOT"],

  //--------Operators---------
  [/^[+\-]/, "ADDITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],
];

module.exports = Spec;
