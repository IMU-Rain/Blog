<template>
  <div class="container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div class="duxiuindex" v-else>
      <h2 class="title">独秀指数 📈</h2>
      <p class="introduction">
        独秀指数是一项衡量个人经济活跃度与生活平衡状况的自定义指标。
        它通过「月收入 ÷
        月支出」计算得出，用以反映一个人在当月的经济独立性与生活压力。
        当指数高于 1，说明收入大于支出，生活相对宽裕； 当指数低于
        1，则意味着支出超过收入，经济压力上升。
        这一指数不仅记录数字的变化，更折射出生活的节奏与状态——
        有时是努力工作的回报，有时是为旅行与梦想买单的瞬间。
        它不是冰冷的统计，而是一份属于“我”的生活报告📊。
      </p>
      <DuxiuIndex height="400px" />
    </div>
    <Aside></Aside>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import Aside from "../components/PoemAside.vue";
import { useRequest } from "../hooks/useRequest";
import { getDuxiuIndex } from "../api/duxiuIndex";
import type { duxiuIndexType } from "../types/duxiuIndex";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
import DuxiuIndex from "../components/DuxiuIndex.vue";
const chartRef = ref<HTMLDivElement | null>(null);
const initChart = (xData: string[], yData: number[]) => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  const option = {
    title: {
      text: "独秀指数趋势图",
      left: "center",
    },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
      name: "指数",
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    series: [
      {
        name: "独秀指数",
        type: "line",
        data: yData,
        smooth: true,
        symbol: "circle",
      },
    ],
  };
  chart.setOption(option);
};
const { data: datas, run, loading, error } = useRequest(getDuxiuIndex);
onMounted(() => {
  const xData = ref<string[]>([]);
  const yData = ref<number[]>([]);
  run().then(() => {
    datas.value.map((data: duxiuIndexType) => {
      xData.value.push(`${data.year}年${data.month}月`);
      yData.value.push(data.duxiuIndex);
    });
    initChart(xData.value, yData.value);
  });
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.container {
  gap: 24px;
  display: grid;
  grid-template-columns: minmax(0, 11fr) minmax(270px, 4fr);
  align-items: start;
  .duxiuindex {
    padding: 22px;
    background: var(--surface-color);
    border: 1px solid var(--line-color);
    border-radius: 16px;
    box-shadow: 0 10px 22px var(--shadow-color);
    text-align: left;
    .title {
      margin: 0 0 14px;
      color: var(--text-color);
    }
    .introduction {
      margin: 0 0 20px;
      color: var(--text-muted);
      line-height: 1.9;
      text-align: left;
    }
  }
}
@media (max-width: 960px) {
  .container {
    grid-template-columns: 1fr;
    .duxiuindex {
      padding: 16px;
      .title {
        font-size: 24px;
      }
    }
  }
}
</style>
