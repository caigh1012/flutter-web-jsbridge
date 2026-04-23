import { pathToFileURL } from 'url';

async function getModuleExports(filePath) {
  try {
    // 将路径转换为 file:// URL (ESM 需要)
    const moduleUrl = pathToFileURL(filePath).href;

    // 动态导入模块
    const module = await import(moduleUrl);

    // 判断是否是 ES Module
    const isESM = !module.__esModule || module[Symbol.toStringTag] === 'Module';

    return {
      isESModule: isESM,
      exports: module.default || module,
      namedExports: module,
    };
  } catch (err) {
    console.error('Error loading module:', err);
    throw err;
  }
}

// 使用示例
// getModuleExports(path.join(__dirname, './bridge-mock.js')).then(({ isESModule, exports, namedExports }) => {
//   console.log('Is ES Module:', isESModule);
//   console.log('Default export:', exports);
//   console.log('Named exports:', namedExports);
// });

export { getModuleExports };
