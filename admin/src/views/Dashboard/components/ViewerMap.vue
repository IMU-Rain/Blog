<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
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

echarts.use([
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
]);
import worldJson from "@/assets/worldMap.json";
const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

const data = [
  { name: "China", value: 1400000000 },
  { name: "United States of America", value: 333000000 },
  { name: "India", value: 1410000000 },
];

onMounted(async () => {
  if (!chartRef.value) return;
  myChart = echarts.init(chartRef.value);

  echarts.registerMap("world", worldJson as any);

  const option: echarts.ComposeOption<
    TitleComponentOption &
      TooltipComponentOption &
      VisualMapComponentOption &
      MapSeriesOption
  > = {
    title: { text: "浏览数据", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        name: "Population",
        type: "map",
        map: "world",
        roam: true,
        emphasis: { label: { show: true } },
        data,
      },
    ],
  };

  myChart.setOption(option);

  const onResize = () => myChart?.resize();
  window.addEventListener("resize", onResize);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
    myChart?.dispose();
    myChart = null;
  });
});
</script>

<template>
  <div class="map-container">
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style scoped lang="less">
</style>
