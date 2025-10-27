<template>
  <div class="economy-container">
    <div ref="chartRef" class="chart" :style="{ height: height }"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import type { duxiuIndexType } from "../types/duxiuIndex";
import { onMounted, ref } from "vue";
import { useRequest } from "../hooks/useRequest";
import { getDuxiuIndex } from "../api/duxiuIndex";

const chartRef = ref<HTMLDivElement | null>(null);
const initChart = (xData: string[], yData: number[]) => {
  if (!chartRef.value) return;
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const primaryColor = isDark ? "rgb(200,200,200)" : "rgb(54,54,54)";
  const accentColor = isDark ? "rgba(200,200,200,0.8)" : "rgba(54,54,54,0.8)";
  const textColor = isDark ? "#e0e0e0" : "#333";
  const chart = echarts.init(chartRef.value);
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
          color: accentColor,
        },
      },
    },
    yAxis: {
      type: "value",
      name: "指数",
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: accentColor } },
      splitLine: { lineStyle: { color: isDark ? "#333" : "#ddd" } },
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
            { offset: 0, color: accentColor },
            { offset: 1, color: "rgba(0,0,0,0)" },
          ]),
        },
      },
    ],
  };
  chart.setOption(option);
};
const { data: datas, run } = useRequest(getDuxiuIndex);
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
defineProps<{ height: string }>();
</script>

<style scoped lang="less">
@import "../style/theme.less";
.economy-container {
  background-color: @card-background-color;
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
  grid-template-columns: 1fr;
}
@media (prefers-color-scheme: dark) {
  .economy-container {
    background-color: @dark-card-background-color;
  }
}
</style>
