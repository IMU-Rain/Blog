<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from "echarts/components";
import { MapChart, type MapSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
} from "echarts";
// 1️⃣ 注册组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
]);

// 2️⃣ 引用 DOM
const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 3️⃣ 固定示例数据
const data = [
  { name: "Alabama", value: 4822023 },
  { name: "Alaska", value: 731449 },
  { name: "Arizona", value: 6553255 },
  { name: "Arkansas", value: 2949131 },
  { name: "California", value: 38041430 },
  { name: "Texas", value: 26059203 },
];

// 4️⃣ 初始化图表
onMounted(() => {
  if (!chartRef.value) return;
  myChart = echarts.init(chartRef.value);

  // 5️⃣ 配置
  const option: echarts.ComposeOption<
    TitleComponentOption &
      TooltipComponentOption &
      VisualMapComponentOption &
      MapSeriesOption
  > = {
    title: {
      text: "示例人口分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    visualMap: {
      min: 500000,
      max: 38000000,
      left: "left",
      top: "bottom",
      text: ["High", "Low"],
      calculable: true,
      inRange: {
        color: ["#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
      },
    },
    series: [
      {
        name: "Population",
        type: "map",
        map: "china", // 这里用 USA 作为示例
        roam: true, // 可缩放和平移
        emphasis: {
          label: { show: true },
        },
        data: [
          { name: "北京", value: 2170 },
          { name: "上海", value: 2424 },
          { name: "广东", value: 11346 },
        ],
      },
    ],
  };

  myChart.setOption(option);

  // 6️⃣ 自适应
  window.addEventListener("resize", () => {
    myChart?.resize();
  });
});
</script>

<template>
  <div class="map-container">
    <div ref="chartRef" style="width: 600px; height: 400px"></div>
  </div>
</template>

<style scoped lang="less"></style>
