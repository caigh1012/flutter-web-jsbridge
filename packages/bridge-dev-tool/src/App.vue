<template>
  <div class="panel">
    <div class="panel-client">
      <div class="panel-client-header">客户端列表</div>
      <div class="panel-client-content">
        <div v-if="clientList.length === 0">
          <el-empty
            image-size="60"
            description="暂无数据">
          </el-empty>
        </div>
        <div v-else>
          <div v-for="item in clientList">{{ item }}</div>
        </div>
      </div>
    </div>
    <div class="panel-send">
      <div class="panel-send-wrap">
        <div class="panel-send-top">
          <div class="panel-send-search">
            <Delete
              style="width: 1em; height: 1em; margin-bottom: -3px; margin-right: 8px"
              @click="clearSendInfo" />
            <el-input
              v-model="searchValue"
              style="width: 320px"
              placeholder="搜索日志"
              clearable />
          </div>
          <div class="panel-send-content">
            <template v-for="item in sendInfoList">
              <li :style="{ 'text-align': item.attr, 'margin-bottom': '8px' }">
                <span v-if="item.attr === 'left'">
                  <span>{{ item.time }}</span> -> <span>{{ item.info }}</span>
                </span>
                <span v-if="item.attr === 'right'">
                  <span>{{ item.info }}</span> <- <span>{{ item.time }}</span>
                </span>
              </li>
            </template>
          </div>
        </div>
        <div class="panel-send-bottom">
          <el-input
            input-style="height: 100%; outline: none; border: none; box-shadow: none;"
            v-model="sendContent"
            resize="none"
            type="textarea"
            placeholder="请输入内容" />
          <div
            class="panel-send-btn"
            @click="sendInfo">
            <span>发送</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import queryString from 'query-string';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { io } from 'socket.io-client';
import { ref, onMounted, onUnmounted } from 'vue';

interface ISendInfo {
  info: string;
  time: string;
  attr: string;
}

const parsed = queryString.parse(location.search);
const { port = 3000 } = parsed;
console.log(parsed);

const socket = io(`ws://localhost:${port}/admin`, { transports: ['websocket'], autoConnect: false });
const clientList = ref<string[]>([]);
const sendInfoList = ref<ISendInfo[]>([]);

const searchValue = ref('');
const sendContent = ref('');

/**
 * 组件挂载完成
 */
onMounted(() => {
  socket.connect();

  // 连接中
  socket.on('connect', (socket) => {
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon) {
      favicon.href = '/connected.png';
    }
  });

  // 断开连接
  socket.on('disconnect', () => {
    document.querySelector("link[rel*='icon']").href = '/unconnected.png';
  });

  // 连接失败
  socket.on('connect_error', (err) => {
    console.warn('连接失败', err);
    document.querySelector("link[rel*='icon']").href = '/unconnected.png';
  });

  // 监听获取客户端列表
  socket.on('client', (client) => {
    clientList.value = client;
  });

  socket.emit('getClient');
});

/**
 * 组件卸载
 */
onUnmounted(() => {
  socket.disconnect();
});

/**
 * 清空发送信息
 */
function clearSendInfo() {
  sendInfoList.value = [];
}

/**
 * 发送信息
 */
function sendInfo() {
  const content = sendContent.value;
  // 发送消息不能为空
  if (!content) {
    ElMessage({
      message: '内容不能为空',
      type: 'warning',
    });
    return;
  }

  /**
   * 发送信息
   */
  if (socket.connected) {
    socket.emit('executeJSProxy', content);
  }

  sendInfoList.value.push({
    time: new Date().toLocaleTimeString(),
    info: content,
    attr: 'left',
  });
}
</script>

<style lang="less" scoped>
.panel {
  height: 100%;
  display: flex;
  gap: 16px;

  &-client {
    width: 20%;
    border-radius: 4px;
    border: 1px solid var(--vt-c-divider-dark-1);

    &-header {
      color: var(--color-heading);
      padding: 10px;
      border-bottom: 1px solid var(--vt-c-divider-dark-1);
    }

    &-content {
      color: var(--color-text);
      height: calc(100% - 42px);
      overflow-y: scroll;
      padding: 8px;
    }
  }

  &-send {
    width: 80%;

    &-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &-top {
      height: 90%;
      border-radius: 4px;
      border: 1px solid var(--vt-c-divider-dark-1);
    }

    &-search {
      color: var(--color-heading);
      padding: 10px;
      border-bottom: 1px solid var(--vt-c-divider-dark-1);
    }

    &-content {
      overflow-y: scroll;
      padding: 16px;
      height: calc(100% - 54px);
    }

    &-bottom {
      border-radius: 4px;
      border: 1px solid var(--vt-c-divider-dark-1);
      height: 10%;
      display: flex;
    }

    &-btn {
      border-radius: 4px;
      background-color: #409eff;
      cursor: pointer;
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
