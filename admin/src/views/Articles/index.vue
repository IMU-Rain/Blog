<script lang="ts" setup>
import { onMounted } from "vue";
import MaxTable from "@/components/MaxTable/index.vue";
import { useTable } from "@/components/MaxTable/useTable";
import type {
  PlusColumn,
  TableButton,
  TableActionPayload,
} from "@/components/MaxTable/types";
import { articleDelete, getArticleList } from "@/api/Articles";
import MaxButton from "@/components/MaxButton.vue";
import { useRouter } from "vue-router";

interface TableRow {
  id: string;
  title: string;
  status: string;
  tags: string;
  createAt: string;
  url: string;
}

const { tableData, buttons } = useTable<TableRow[]>();

buttons.value = [
  {
    text: "修改",
    code: "edit",
    icon: "solar:pen-new-square-outline",
    props: (row) => ({
      type: "primary",
      size: "small",
      disabled: row.status === "1",
    }),
  },
  {
    text: "删除",
    code: "delete",
    icon: "solar:trash-bin-minimalistic-outline",
    props: {
      type: "danger",
      size: "small",
      plain: true,
    },
    confirm: {
      title: "删除确认",
      message: "确定删除这篇文章吗？该操作不可恢复。",
    },
  },
] as TableButton<TableRow>[];

const tableConfig: PlusColumn<TableRow>[] = [
  {
    label: "ID",
    prop: "id",
    width: "300px",
    align: "center",
    fieldProps: {
      width: "48px",
      height: "48px",
      radius: "14px",
    },
  },
  {
    label: "标题",
    prop: "title",
    align: "center",
  },
  {
    label: "状态",
    prop: "status",
    valueType: "select",
    align: "center",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red",
      },
      {
        label: "已解决",
        value: "1",
        color: "blue",
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow",
      },
      {
        label: "失败",
        value: "3",
        color: "red",
      },
    ],
  },
  {
    label: "标签",
    prop: "tags",
    valueType: "tag",
    align: "center",
    fieldProps: (value: string) => {
      return { type: value };
    },
  },
  {
    label: "时间",
    prop: "createAt",
    align: "center",
    valueType: "date-picker",
    width: "200px",
  },
];
const handleDelete = (id: string) => {
  articleDelete(id).then((res) => {
    if (res.code === 200) {
      setTableData();
    }
  });
};
const handleEdit = (id: string) => {
  router.push({ path: "/Articles/Edit", query: { id } });
};
const onTableAction = (payload: TableActionPayload<TableRow>) => {
  const { code, row } = payload;
  switch (code) {
    case "delete":
      handleDelete(row.id);
      break;
    case "edit":
      handleEdit(row.id);
      break;
  }
};
const router = useRouter();
const setTableData = () => {
  getArticleList().then((res) => {
    if (res.code === 200) {
      res.data.forEach((item: TableRow) => {
        const baseURL = import.meta.env.VITE_BASEURL;
        item.url = baseURL + item.url;
      });
      tableData.value = res.data;
    }
  });
};
onMounted(() => {
  setTableData();
});
</script>

<template>
  <div class="container">
    <div class="upper">
      <div class="upper-title">文章管理</div>
      <div class="upper-actions">
        <MaxButton
          icon="icon-park-outline:left"
          height="16"
          color="#4f86d8"
          @click="router.back()"
        >
          返回主页
        </MaxButton>
        <MaxButton
          icon="formkit:add"
          height="16"
          color="#2f7ccf"
          @click="router.push('/Articles/Edit')"
        >
          新增文章
        </MaxButton>
      </div>
    </div>
    <MaxTable
      :data="tableData"
      :columns="tableConfig"
      :buttons="buttons"
      @action="onTableAction"
    />
  </div>
</template>

<style scoped lang="less">
.container {
  width: min(1260px, 94vw);
  margin: 0 auto;

  .upper {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    padding: 10px 4px 14px;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--line-color);
    margin-bottom: 12px;

    .upper-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
      letter-spacing: 0.3px;
    }

    .upper-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .upper-actions :deep(.button-container) {
      border-width: 1px;
      border-radius: 999px;
      min-height: 34px;
      padding: 8px 14px;
      box-shadow: 0 6px 14px var(--shadow-color);
    }
  }
}

@media (max-width: 700px) {
  .container {
    .upper {
      justify-content: flex-start;

      .upper-title {
        width: 100%;
      }
    }
  }
}
</style>
