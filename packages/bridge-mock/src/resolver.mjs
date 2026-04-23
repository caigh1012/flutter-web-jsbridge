import t from '@babel/types';

const StringResolver = {
  is(src) {
    return t.isStringLiteral(src);
  },
  get(src) {
    return src.value;
  },
};

const NumberResolver = {
  is(src) {
    return t.isNumericLiteral(src);
  },
  get(src) {
    return src.value;
  },
};

const BooleanResolver = {
  is(src) {
    return t.isBooleanLiteral(src);
  },
  get(src) {
    return src.value;
  },
};

const NullResolver = {
  is(src) {
    return t.isNullLiteral(src);
  },
  get() {
    return null;
  },
};

const UndefinedResolver = {
  is(src) {
    return t.isIdentifier(src) && src.name === 'undefined';
  },
  get() {
    return undefined;
  },
};

const ObjectLiteralResolver = {
  is(src) {
    return t.isObjectExpression(src);
  },
  get(src) {
    return findObjectLiteralProperties(src);
  },
};

const ObjectResolver = {
  is(src) {
    return t.isObjectExpression(src);
  },
  get(src) {
    return findObjectMembers(src);
  },
};

const ClassResolver = {
  is(src) {
    return t.isClass(src);
  },
  get(src) {
    return findClassStaticProperty(src);
  },
};

const ArrayLiteralResolver = {
  is(src) {
    return t.isArrayExpression(src);
  },
  get(src) {
    return findArrayLiteralElements(src);
  },
};

const ArrayResolver = {
  is(src) {
    return t.isArrayExpression(src);
  },
  get(src) {
    return findArrayElements(src);
  },
};

const FunctionResolver = {
  is(src) {
    return t.isFunctionExpression(src);
  },
  get() {
    return function () {};
  },
};

const ArrowFunctionResolver = {
  is(src) {
    return t.isArrowFunctionExpression(src);
  },
  get() {
    return () => {};
  },
};

export const NODE_RESOLVERS = [
  StringResolver,
  NumberResolver,
  BooleanResolver,
  NullResolver,
  UndefinedResolver,
  ObjectResolver,
  ArrayResolver,
  ClassResolver,
  FunctionResolver,
  ArrowFunctionResolver,
];
