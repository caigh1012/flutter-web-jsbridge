import babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import t from '@babel/types';
import path from 'path';
import { readFileSync } from 'fs';

function getExportDefault(options) {
  const { BRIDGE_MOCK_FILE_PATH = 'bridge-mock.js' } = process.env;
  const { fileName = BRIDGE_MOCK_FILE_PATH } = options;

  let props = undefined;
  const file = readFileSync(fileName, 'utf8');

  /**
   * 解析ast
   */
  const ast = babelParser.parse(file, {
    sourceType: 'module',
  });

  console.log(ast, 'ast');

  // traverse.default(ast, {
  //   Program(path) {
  //     const node = path.node;
  //     const defaultExport = findExportDefault(node);
  //     if (!defaultExport) return;
  //     if (t.isObjectExpression(defaultExport)) {
  //       props = findObjectMembers(defaultExport);
  //     } else {
  //       const resolver = NODE_RESOLVERS.find((resolver) => resolver.is(defaultExport));
  //       if (resolver) {
  //         props = resolver.get(defaultExport);
  //       }
  //     }
  //   },
  // });
  return props;
}

function findExportDefault(programNode) {
  const body = programNode.body;
  for (const n of body) {
    if (t.isExportDefaultDeclaration(n)) {
      return n.declaration;
    }
  }
  return null;
}

function findObjectMembers(node) {
  const target = {};
  node.properties.forEach((p) => {
    if (t.isIdentifier(p.key)) {
      if (t.isObjectMethod(p)) {
        target[p.key.name] = () => {};
      } else {
        console.log(4444);
        console.log(t.isNumericLiteral(p.value));

        const resolver = NODE_RESOLVERS.find((resolver) => resolver.is(p.value));
        console.log(resolver, 'resolver');

        if (resolver) {
          target[p.key.name] = resolver.get(p.value);
        }
      }
    }
  });
  return target;
}

export { getExportDefault };
