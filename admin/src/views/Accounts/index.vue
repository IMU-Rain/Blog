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
import { deleteUser, getUserList } from "@/api/users";
import {
  getErrorMessage,
  showErrorMessage,
  showSuccessMessage,
} from "@/utils/message";
import { useRouter } from "vue-router";

interface AccountRow {
  id: string;
  username: string;
  nickname: string;
  role: string;
  status: string;
  createAt: string;
}

const router = useRouter();
const { tableData, buttons } = useTable<AccountRow[]>();

buttons.value = [
  {
    text: "删除",
    code: "delete",
    icon: "solar:trash-bin-minimalistic-outline",
    props: (row) => ({
      type: "danger",
      size: "small",
      plain: true,
      disabled: row.role === "admin",
    }),
    confirm: {
      title: "删除确认",
      message: "确定删除这个账号吗？该账号的评论也会从前台隐藏。",
    },
  },
] as TableButton<AccountRow>[];

const tableConfig: PlusColumn<AccountRow>[] = [
  {
    label: "账号ID",
    prop: "id",
    width: "250px",
    align: "center",
  },
  {
    label: "用户名",
    prop: "username",
    width: "140px",
    align: "center",
  },
  {
    label: "昵称",
    prop: "nickname",
    width: "140px",
    align: "center",
  },
  {
    label: "角色",
    prop: "role",
    width: "100px",
    align: "center",
    valueType: "tag",
    fieldProps: (_value, row) => ({
      type: row.role === "admin" ? "primary" : "default",
    }),
  },
  {
    label: "状态",
    prop: "status",
    width: "110px",
    align: "center",
    valueType: "tag",
    fieldProps: (_value, row) => ({
      type: row.status === "active" ? "success" : "warning",
    }),
    render: (value) => (value === "active" ? "正常" : "禁用"),
  },
  {
    label: "注册时间",
    prop: "createAt",
    width: "190px",
    align: "center",
    valueType: "date-picker",
  },
];

const normalizeUser = (item: any): AccountRow => ({
  id: item.id || item._id,
  username: item.username,
  nickname: item.nickname || item.username,
  role: item.role,
  status: item.status,
  createAt: item.createAt,
});

const loadUsers = async () => {
  try {
    const res = await getUserList();
    if (res.code === 200) {
      tableData.value = Array.isArray(res.data)
        ? res.data.map(normalizeUser)
        : [];
    }
  } catch (error) {
    showErrorMessage(getErrorMessage(error, "账号列表加载失败"));
  }
};

const handleDelete = async (id: string) => {
  try {
    const res = await deleteUser(id);
    if (res.code === 200) {
      showSuccessMessage(
        "账号删除成功",
        "solar:trash-bin-minimalistic-outline",
      );
      loadUsers();
    }
  } catch (error) {
    showErrorMessage(getErrorMessage(error, "账号删除失败"));
  }
};

const onTableAction = (payload: TableActionPayload<AccountRow>) => {
  if (payload.code === "delete") {
    handleDelete(payload.row.id);
  }
};

onMounted(loadUsers);
</script>

<template>
  <div class="container">
    <div class="upper">
      <div>
        <div class="upper-title">账号管理</div>
      </div>
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
          @click="loadUsers"
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

    .upper-note {
      margin: 6px 0 0;
      color: var(--text-muted);
      font-size: 13px;
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
