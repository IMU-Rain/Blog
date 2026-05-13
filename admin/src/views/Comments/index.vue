<script lang="ts" setup>
import { onMounted } from "vue";
import MaxButton from "@/components/MaxButton.vue";
import MaxTable from "@/components/MaxTable/index.vue";
import { useTable } from "@/components/MaxTable/useTable";
import type {
  PlusColumn,
  TableActionPayload,
  TableButton,
} from "@/components/MaxTable/types";
import { deleteComment, getCommentList } from "@/api/comments";
import {
  getErrorMessage,
  showErrorMessage,
  showSuccessMessage,
} from "@/utils/message";
import { useRouter } from "vue-router";

interface CommentRow {
  id: string;
  author: string;
  targetType: string;
  targetTitle: string;
  content: string;
  createAt: string;
}

const router = useRouter();
const { tableData, buttons } = useTable<CommentRow[]>();

buttons.value = [
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
      message: "确定删除这条评论吗？该操作会从前台隐藏评论。",
    },
  },
] as TableButton<CommentRow>[];

const tableConfig: PlusColumn<CommentRow>[] = [
  {
    label: "评论ID",
    prop: "id",
    width: "260px",
    align: "center",
  },
  {
    label: "作者",
    prop: "author",
    width: "140px",
    align: "center",
  },
  {
    label: "位置",
    prop: "targetTitle",
    width: "220px",
    align: "center",
  },
  {
    label: "类型",
    prop: "targetType",
    width: "100px",
    align: "center",
    render: (value) => (value === "article" ? "文章" : "照片"),
  },
  {
    label: "内容",
    prop: "content",
    align: "left",
    render: (value) => String(value || "").slice(0, 120),
  },
  {
    label: "时间",
    prop: "createAt",
    width: "190px",
    align: "center",
    valueType: "date-picker",
  },
];

const normalizeComment = (item: any): CommentRow => ({
  id: item._id,
  author: item.author?.nickname || item.author?.username || "匿名",
  targetType: item.targetType,
  targetTitle: item.targetTitle || "目标已删除",
  content: item.content,
  createAt: item.createAt,
});

const loadComments = async () => {
  try {
    const res = await getCommentList();
    if (res.code === 200) {
      tableData.value = Array.isArray(res.data)
        ? res.data.map(normalizeComment)
        : [];
    }
  } catch (error) {
    showErrorMessage(getErrorMessage(error, "评论列表加载失败"));
  }
};

const handleDelete = async (id: string) => {
  try {
    const res = await deleteComment(id);
    if (res.code === 200) {
      showSuccessMessage("评论删除成功", "solar:trash-bin-minimalistic-outline");
      loadComments();
    }
  } catch (error) {
    showErrorMessage(getErrorMessage(error, "评论删除失败"));
  }
};

const onTableAction = (payload: TableActionPayload<CommentRow>) => {
  if (payload.code === "delete") {
    handleDelete(payload.row.id);
  }
};

onMounted(loadComments);
</script>

<template>
  <div class="container">
    <div class="upper">
      <div class="upper-title">评论管理</div>
      <div class="upper-actions">
        <MaxButton
          icon="icon-park-outline:left"
          height="16"
          color="#4f86d8"
          @click="router.push('/Dashboard')"
        >
          返回主页
        </MaxButton>
        <MaxButton
          icon="mdi:refresh"
          height="16"
          color="#2f7ccf"
          @click="loadComments"
        >
          刷新
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
</style>
