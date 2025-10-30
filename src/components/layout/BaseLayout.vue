<template>
    <div class="layout-root">
        <!-- 顶部导航栏 -->
        <header class="layout-header">
            <slot name="header">
                <!-- 默认头部内容 -->
                <div class="header-inner">三维管线管理系统</div>
            </slot>
        </header>

        <!-- 下部分，左-中-右结构 -->
        <div class="layout-body">
            <aside class="layout-sidebar">
                <slot name="sidebar">
                    <!-- 默认侧边栏内容 -->
                    <div class="sidebar-placeholder"></div>
                </slot>
            </aside>
            <main class="layout-main">
                <slot></slot>
            </main>
            <aside class="layout-right-panel">
                <slot name="right">
                    <!-- 默认右侧面板占位内容 -->
                    <div class="right-placeholder"></div>
                </slot>
            </aside>
        </div>
    </div>
</template>

<style scoped>
.layout-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.layout-header {
    height: 80px;
    background: linear-gradient(90deg, #1a1d2e 0%, #2a2d3e 100%);
    color: #e8eaed;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    padding: 0 20px;
    z-index: 2;
}

.header-inner {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.layout-body {
    display: flex;
    flex: 1;
    min-height: 0;
    background: #161924;
}

.layout-sidebar {
    width: 56px;
    background: linear-gradient(180deg, #1a1d2e 0%, #2a2d3e 100%);
    border-right: 1px solid rgba(77, 171, 247, 0.18);
    box-shadow: 3px 0 12px rgba(0, 0, 0, 0.18);
    min-width: 40px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    z-index: 1;
}

.sidebar-placeholder {
    flex: 1;
}

.layout-main {
    flex: 1;
    overflow: auto;
}

.layout-right-panel {
    width: 300px;
    background: linear-gradient(180deg, #1a1d2e 0%, #2a2d3e 100%);
    border-left: 1px solid rgba(77, 171, 247, 0.18);
    box-shadow: -3px 0 12px rgba(0, 0, 0, 0.18);
    overflow: hidden;
}

.right-placeholder {
    height: 100%;
}
</style>
