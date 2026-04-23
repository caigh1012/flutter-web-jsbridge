import chokidar from 'chokidar';
import path from 'path';
import { pathExistsSync } from 'fs-extra/esm';
import { log, error } from './log';
import { getModuleExports } from './module';

function watchFileChange(http, options, io) {
  const { BRIDGE_MOCK_FILE_PATH = 'bridge-mock.js', BRIDGE_MOCK_PORT = 3000 } = process.env;
  const { file = BRIDGE_MOCK_FILE_PATH } = options;
  const mockPort = BRIDGE_MOCK_PORT;

  // bridge-mock.js 文件路径
  const dataFile = path.join(process.cwd(), file);

  function reloadServer() {
    const port = mockPort || 3000;
    http.close();
    http.listen(port, function () {
      log(`正在监听 *:${port}, admin控制台访问地址： http://localhost:${port}?port=${port}`);
    });
  }

  /**
   * 需要先加载 bridge-mock.js 数据
   */
  async function reloadData() {
    if (!pathExistsSync(dataFile)) {
      error(`无法加载 ${dataFile}，请检查文件路径是否正确`);
      return;
    }

    const moduleData = await getModuleExports(dataFile);

    if (!moduleData.isESModule) {
      error(`当前文件 ${dataFile} 不是 ES Module，请检查文件格式`);
      return;
    }

    log(`${dataFile} 加载成功`);
    // reloadServer();
  }

  const watcher = chokidar.watch(dataFile, { ignoreInitial: true });

  // 监听文件变化
  watcher.on('all', () => {
    log(`检测到文件变化，正在重新加载 ${dataFile}`);
    reloadData();
  });

  reloadData();
}

export default watchFileChange;
