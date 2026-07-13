<script setup lang="ts">
// LabelSwap — AutoHeight 的横向同款:一段会"换字"的内容(按钮的 Connect↔Cancel、
// 徽标的状态词),每个候选 label 保持各自的自然宽度,切换时外壳宽度平滑过渡到
// 当前 label 的宽度(右对齐场景下滑动的是左边缘),label 本身只做透明度交叉淡出。
//
// 用法:每个候选 label 一个具名 slot,`active` 指名当前显示哪个:
//   <LabelSwap :active="pending ? 'cancel' : 'connect'">
//     <template #connect><KeyRound /> Connect</template>
//     <template #cancel>Cancel</template>
//   </LabelSwap>
//
// 实现要点(每一条都是试点期踩过的坑):
// - 所有 label 叠进同一个 grid 单元格:高度走正常文档流(宿主的 items-center 负责
//   垂直居中,绝对定位版曾把外壳高度塌成 0 → overflow-hidden 整个裁掉)。
// - 叠格轨道恒按最宽的 label 定尺寸,外壳收窄后轨道若靠左锚定,裁掉的全是右侧
//   ("Canc|" 事故)——外壳 justify-center + 项 justify-self-center 让裁切对称,
//   当前 label 的中心恒等于外壳中心,永远完整可见。
// - 量宽用 ceil(getBoundingClientRect().width):offsetWidth 取整会把 79.4 量成
//   79,差的 <1px 在 overflow-hidden 下就是文字被啃边。
// - ResizeObserver 持续跟踪(webfont 晚载、locale 换字都会自愈),不是量一次了事。
// - 首帧不动画:先提交初始宽度、下一帧才启用过渡,与 AutoHeight 的"mount 即成品"
//   约定一致。duration/easing 锁死在本组件(house spring,同 AutoHeight),不开
//   prop —— 所有调用方动效一致,单处可改。
// - 非激活 label 保持挂载(宽度要随时可量)但 aria-hidden,不参与可访问名。
// - 外壳与 item 都 [gap:inherit],让 slot 里的图标↔文字间距继承宿主的 gap 契约
//   (Button: gap-2 / sm gap-1.5),调用方不需要、也不应该手写 mr/ml。注意 gap
//   不是继承属性,这条链要求 DOM 父链上每一层都显式转发 —— Button 的
//   data-button-content 包装层(display:contents,布局消失但继承链仍在)已内建
//   [gap:inherit] 转发;其他宿主若不转发,slot 内容间距为 0,由调用方自理。
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const props = defineProps<{
  /** 当前显示的 slot 名。 */
  active: string
}>()

const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))

// 非响应式 Map:测量由 active 变化(watch)与尺寸变化(ResizeObserver)驱动,
// ref 本身的增删不需要触发渲染。
const items = new Map<string, HTMLElement>()
const width = ref<number | null>(null)
const ready = ref(false)
let observer: ResizeObserver | null = null

function setItemRef(name: string, el: Element | ComponentPublicInstance | null) {
  const node = el instanceof HTMLElement ? el : null
  const prev = items.get(name)
  if (prev && prev !== node) observer?.unobserve(prev)
  if (node) {
    items.set(name, node)
    observer?.observe(node)
  } else {
    items.delete(name)
  }
}

function measure() {
  const el = items.get(props.active)
  if (el) width.value = Math.ceil(el.getBoundingClientRect().width)
}

onMounted(() => {
  observer = new ResizeObserver(measure)
  for (const el of items.values()) observer.observe(el)
  measure()
  // 先提交初始宽度,下一帧才开过渡 —— mount 本身不做从 0/auto 起步的动画。
  requestAnimationFrame(() => {
    ready.value = true
  })
})

watch(() => props.active, measure, { flush: 'post' })

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <span
    data-slot="label-swap"
    class="grid justify-center overflow-hidden [gap:inherit]"
    :class="{ 'label-swap-animated': ready }"
    :style="width !== null ? { width: `${width}px` } : undefined"
  >
    <span
      v-for="name in slotNames"
      :key="name"
      :ref="(el) => setItemRef(name, el)"
      class="col-start-1 row-start-1 flex w-max items-center justify-self-center whitespace-nowrap transition-opacity duration-150 [gap:inherit]"
      :class="name === props.active ? 'opacity-100' : 'opacity-0'"
      :aria-hidden="name !== props.active || undefined"
    >
      <slot :name="name" />
    </span>
  </span>
</template>

<style scoped>
/* 200ms:比 AutoHeight(220ms,大面)略快 —— 一个按钮量级的小面,同一根 house
   spring 曲线。这两个数值是组件契约,调用方不可覆写。 */
.label-swap-animated {
  transition: width 200ms cubic-bezier(0.32, 0.72, 0, 1);
}
@media (prefers-reduced-motion: reduce) {
  .label-swap-animated {
    transition: none;
  }
}
</style>
