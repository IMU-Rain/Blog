<template>
  <div class="duxiuindex-container">
    <DuxiuIndex height="400px"></DuxiuIndex>
    <el-form>
      <div class="left">
        <el-input
          class="sallary"
          v-model="duxiuData.number.income"
          placeholder="本月收入"
          type="number"
          step="100"
          prefix-icon="Money"
          maxlength="5"
          size="large"
        />

        <el-input
          type="number"
          step="100"
          class="expense"
          v-model="duxiuData.number.expense"
          prefix-icon="ShoppingCartFull"
          size="large"
          maxlength="5"
        />
      </div>
      <div class="right">
        <el-date-picker
          class="date-picker"
          v-model="duxiuData.date"
          type="month"
          size="large"
          placeholder="Pick a Month"
        />
        <el-button size="large" @click="update" :loading>提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import DuxiuIndex from "../../components/DuxiuIndex.vue";
import { useRequest } from "../../hooks/useRequest";
import { updateNewDuxiuIndex } from "../../api/duxiuIndex";
const duxiuData = ref({
  date: new Date(),
  number: { income: 4270, expense: 0 },
});
const { run, loading } = useRequest(updateNewDuxiuIndex);
const update = () => {
  const month = duxiuData.value.date.getMonth() + 1;
  const year = duxiuData.value.date.getFullYear();
  const income = duxiuData.value.number.income;
  const expense = duxiuData.value.number.expense;
  run({ month, year, income, expense }).then(()=>{
    location.reload()
  });
};
</script>

<style scoped lang="less">
.duxiuindex-container {
  padding: 1rem;
  border-radius: 8px;
  overflow: hidden;
  .el-form {
    display: flex;
    margin-top: 3rem;
    justify-content: space-between;
    padding: 0 20%;
    .left {
      .sallary {
        margin-bottom: 20px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .date-picker {
        display: block;
      }
      .right {
        display: block;
      }
    }
  }
}
</style>
