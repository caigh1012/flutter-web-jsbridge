import babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import { NODE_RESOLVERS } from './resolver.mjs';
import t from '@babel/types';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('dirname', __dirname);
console.log('filename', __filename);

const filePath = path.join(__dirname, '../bridge-mock.js');
console.log('filePath', filePath);

const fileStr = readFileSync(filePath, 'utf8');

const ast = babelParser.parse(fileStr, {
  sourceType: 'module',
});

function getExportProps(code) {
  let props = undefined;
  traverse.default(code, {
    Program(path) {
      const node = path.node;
      const defaultExport = findExportDefault(node);
      if (!defaultExport) return;
      if (t.isObjectExpression(defaultExport)) {
        props = findObjectMembers(defaultExport);
      } else {
        const resolver = NODE_RESOLVERS.find((resolver) => resolver.is(defaultExport));
        if (resolver) {
          props = resolver.get(defaultExport);
        }
      }
    },
  });
  return props;
}

const props = getExportProps(ast);
console.log(props, 'props');
