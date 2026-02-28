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

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
]);

// 导入世界地图 JSON 数据
import worldJson from "@/assets/worldMap.json";
import { getViewerMap } from "@/api/DataCard";

// 图表容器引用
const chartRef = ref<HTMLDivElement | null>(null);
// 图表实例
let myChart: echarts.ECharts | null = null;
// 窗口resize回调
let resizeHandler: () => void;

// 访客数据（名称需匹配worldMap.json中的国家名称）
const visitorData = ref([]);
const initMap = () => {
  if (!chartRef.value) return;

  // 初始化图表
  myChart = echarts.init(chartRef.value);

  echarts.registerMap("world", worldJson as any);

  // 图表配置项
  const option: echarts.ComposeOption<
    TitleComponentOption &
      TooltipComponentOption &
      VisualMapComponentOption &
      MapSeriesOption
  > = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>访客数：{c}",
    },
    visualMap: {
      min: 0,
      max: 5000,
      left: "left",
      bottom: 100,
      calculable: true,
      inRange: {
        color: ["#e0f7fa", "#4dd0e1", "#0097a7", "#006064"],
      },
    },
    series: [
      {
        name: "访客数",
        type: "map",
        map: "world", // 必须和registerMap的第一个参数一致
        roam: true,
        zoom: 2,
        center: [40, 30],
        emphasis: {
          label: { show: true, fontSize: 12 },
          itemStyle: { areaColor: "#ffcc80" },
        },
        itemStyle: {
          areaColor: "#f5f5f5",
          borderColor: "#dddddd",
          borderWidth: 0.5,
        },
        data: visitorData.value,
      },
    ],
  };

  myChart.setOption(option);

  // 窗口自适应
  resizeHandler = () => myChart?.resize();
  window.addEventListener("resize", resizeHandler);
};
onMounted(() => {
  getViewerMap()
    .then((res) => {
      if (res.code === 200) {
        visitorData.value = res.data;
      }
    })
    .finally(() => {
      initMap();
    });
});

// 组件卸载时清理资源
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandler);
  myChart?.dispose();
  myChart = null;
});
</script>

<template>
  <div class="map-container">
    <div ref="chartRef" class="map"></div>
  </div>
</template>

<style scoped lang="less">
.map-container {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  .map {
    width: 100%;
    height: 400px;
    margin: 0 auto;
  }
}
</style>
