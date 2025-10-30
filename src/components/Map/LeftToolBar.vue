<template>
    <nav class="left-toolbar">
        <div v-for="(item, idx) in tools" :key="item.name" class="icon-btn-wrap" @mouseleave="onMouseLeave(idx)">
            <button class="icon-btn" :class="{ active: activeIdx === idx }" @click="togglePanel(idx)">
                <span v-html="item.icon" />
                <span class="icon-label">{{ item.name }}</span>
            </button>

            <!-- 面板浮出 -->
            <div v-if="activeIdx === idx" class="float-panel">
                <button v-for="(sub, j) in item.groupIcons" :key="sub.name" class="sub-icon-btn"
                    @click.stop="onGroupClick(idx, j)">
                    <span v-html="sub.icon" />
                    <span class="sub-label">{{ sub.name }}</span>
                </button>
            </div>
        </div>
        <slot></slot>
    </nav>
</template>

<script setup>
import { ref } from 'vue';
// 示例主按钮对象和二级组
const tools = [
    {
        name: '地图',
        icon: `<svg width="22" height="22" fill="none" stroke="#4dabf7" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>`,
        groupIcons: [
            { name: '放大', icon: `<svg width='18' height='18' fill='none' stroke='#4dabf7' viewBox='0 0 24 24'><path d='M12 5v14M5 12h14'/></svg>` },
            { name: '缩小', icon: `<svg width='18' height='18' fill='none' stroke='#4dabf7' viewBox='0 0 24 24'><path d='M5 12h14'/></svg>` }
        ]
    },
    {
        name: '标绘',
        icon: `<svg width="22" height="22" fill="none" stroke="#e67e22" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`,
        groupIcons: [
            { name: '点', icon: `<svg width='18' height='18' fill='none' stroke='#e67e22' viewBox='0 0 24 24'><circle cx='12' cy='12' r='4'/></svg>` },
            { name: '线', icon: `<svg width='18' height='18' fill='none' stroke='#e67e22' viewBox='0 0 24 24'><path d='M6 18L18 6'/></svg>` }
        ]
    },
    {
        name: '图层',
        icon: `<svg width="22" height="22" fill="none" stroke="#27ae60" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6l16 0"/><path d="M4 12l16 0"/><path d="M4 18l16 0"/></svg>`,
        groupIcons: [
            { name: '底图', icon: `<svg width='18' height='18' fill='none' stroke='#27ae60' viewBox='0 0 24 24'><rect x='6' y='6' width='12' height='12' rx='2'/></svg>` }
        ]
    },
    {
        name: '工具',
        icon: `<svg width="22" height="22" fill="none" stroke="#f54291" stroke-width="2" viewBox="0 0 24 24"><polygon points="12,3 21,21 3,21"/></svg>`,
        groupIcons: [
            { name: '量算', icon: `<svg width='18' height='18' fill='none' stroke='#f54291' viewBox='0 0 24 24'><rect x='5' y='11' width='14' height='2'/></svg>` }
        ]
    }
];
const activeIdx = ref(null);

function togglePanel(idx) {
    activeIdx.value = activeIdx.value === idx ? null : idx;
}
function onGroupClick(mainIdx, groupIdx) {
    // 这里可emit事件或回调给父级
    // 例：console.log(tools[mainIdx].name, tools[mainIdx].groupIcons[groupIdx].name)
}
function onMouseLeave(idx) {
    // 退出主按钮区域时可收起，或点击空白处控制，后续可按具体交互调整
    // activeIdx.value = null; // 如需自动关闭面板可开
}
</script>

<style scoped>
.left-toolbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 56px;
    height: 100%;
    background: transparent;
    padding: 10px 0;
    gap: 18px;
    position: relative;
}

.icon-btn-wrap {
    position: relative;
    width: 100%;
}

.icon-btn {
    background: none;
    border: none;
    outline: none;
    width: 38px;
    height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.18s;
    margin: 0 auto;
}

.icon-btn .icon-label {
    font-size: 12px;
    color: #8eadbd;
    margin-top: 2px;
    line-height: 1.2;
}

.icon-btn.active {
    background: rgba(77, 171, 247, 0.10);
    color: #4dabf7;
}

.icon-btn:hover {
    background: rgba(77, 171, 247, 0.09);
}

.float-panel {
    position: absolute;
    left: 48px;
    top: 4px;
    z-index: 99;
    display: flex;
    flex-direction: column;
    background: #21233a;
    border-radius: 8px;
    box-shadow: 0 2px 18px 0 rgba(46, 79, 114, 0.18);
    padding: 10px 6px;
    min-width: 88px;
    min-height: 40px;
    align-items: flex-start;
    justify-content: flex-start;
    animation: panel-fade-in 0.18s;
}

@keyframes panel-fade-in {
    0% {
        opacity: 0;
        transform: translateX(10px);
    }

    100% {
        opacity: 1;
        transform: none;
    }
}

.sub-icon-btn {
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    color: #b5cee5;
    font-size: 13px;
    line-height: 1.7;
    border-radius: 4px;
    padding: 2px 4px 2px 1px;
    margin-bottom: 5px;
    transition: background 0.15s;
    width: 100%;
}

.sub-icon-btn:last-child {
    margin-bottom: 0;
}

.sub-icon-btn:hover {
    background: rgba(77, 171, 247, 0.07);
    color: #fff;
}

.sub-label {
    margin-left: 6px;
}
</style>
