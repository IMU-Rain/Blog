<template>
  <div class="economy-container">
    <div ref="chartRef" class="chart" :style="{ height: height }"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import type { duxiuIndexType } from "../types/duxiuIndex";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRequest } from "../hooks/useRequest";
import { getDuxiuIndex } from "../api/duxiuIndex";

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const getThemeColors = () => {
  const root = getComputedStyle(document.documentElement);
  return {
    primaryColor: root.getPropertyValue("--primary-color").trim() || "#3d70a8",
    primaryWeak: root.getPropertyValue("--primary-weak").trim() || "rgba(61,112,168,0.14)",
    textColor: root.getPropertyValue("--text-color").trim() || "#1d2b3b",
    lineColor: root.getPropertyValue("--line-color").trim() || "#d7e0eb",
  };
};

const initChart = (xData: string[], yData: number[]) => {
  if (!chartRef.value) return;
  const { primaryColor, primaryWeak, textColor, lineColor } = getThemeColors();
  chartInstance?.dispose();
  chartInstance = echarts.init(chartRef.value);
  const option = {
    title: {
      text: "独秀指数趋势图",
      left: "center",
      textStyle: {
        color: textColor,
      },
    },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: lineColor,
        },
      },
    },
    yAxis: {
      type: "value",
      name: "指数",
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: lineColor } },
      splitLine: { lineStyle: { color: lineColor } },
    },
    series: [
      {
        name: "独秀指数",
        type: "line",
        data: yData,
        smooth: true,
        symbol: "circle",
        itemStyle: { color: primaryColor },
        lineStyle: { color: primaryColor, width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: primaryWeak },
            { offset: 1, color: "rgba(0,0,0,0)" },
          ]),
        },
      },
    ],
  };
  chartInstance.setOption(option);
};
const { data: datas, run } = useRequest(getDuxiuIndex);
const handleResize = () => {
  chartInstance?.resize();
};
onMounted(() => {
  const xData = ref<string[]>([]);
  const yData = ref<number[]>([]);
  window.addEventListener("resize", handleResize);
  run().then(() => {
    datas.value.map((data: duxiuIndexType) => {
      xData.value.push(`${data.year}年${data.month}月`);
      yData.value.push(data.duxiuIndex);
    });
    initChart(xData.value, yData.value);
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});
defineProps<{ height: string }>();
</script>

<style scoped lang="less">
@import "../style/theme.less";
.economy-container {
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
  padding: 12px 12px 8px;
  width: 100%;

  .introduction {
    text-indent: 4%;
    text-align: left;
  }

  .chart {
    display: block;
    text-align: center;
    width: 100%;
  }
}
@media (max-width: 768px) {
  .economy-container {
    padding: 10px 8px 4px;
  }
}
</style>
