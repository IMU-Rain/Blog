<template>
  <div class="max-table">
    <div class="table-shell">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="String(column.prop)"
              :style="getColumnStyle(column)"
              :class="['align-' + (column.align || 'left')]"
            >
              {{ column.label }}
            </th>
            <th v-if="hasOperation" class="operation-head align-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!data.length">
            <td :colspan="columns.length + (hasOperation ? 1 : 0)" class="empty-cell">
              暂无数据
            </td>
          </tr>

          <tr v-for="(row, index) in data" :key="resolveRowKey(row, index)">
            <td
              v-for="column in columns"
              :key="String(column.prop)"
              :class="['align-' + (column.align || 'left')]"
            >
              <template v-if="column.valueType === 'image'">
                <img
                  v-if="getCellValue(row, column)"
                  class="table-image"
                  :src="String(getCellValue(row, column))"
                  :alt="column.label"
                  :style="getImageStyle(getCellValue(row, column), row, column)"
                />
                <span v-else class="muted">-</span>
              </template>

              <template v-else-if="column.valueType === 'select'">
                <span :style="getSelectTextStyle(row, column)">
                  {{ renderSelectLabel(row, column) }}
                </span>
              </template>

              <template v-else-if="column.valueType === 'tag'">
                <span class="table-tag" :class="getTagClass(row, column)">
                  {{ renderTagText(row, column) }}
                </span>
              </template>

              <template v-else>
                {{ renderCellText(row, column, index) }}
              </template>
            </td>

            <td v-if="hasOperation" class="operation-cell align-center">
              <MaxButton
                v-for="button in getVisibleButtons(row)"
                :key="button.code"
                class="table-button"
                :class="[
                  'btn-' + getButtonProps(button, row).type,
                  'btn-' + getButtonProps(button, row).size,
                  { 'is-plain': getButtonProps(button, row).plain }
                ]"
                :icon="resolveButtonIcon(button) || ''"
                :height="getButtonHeight(getButtonProps(button, row).size)"
                :color="getButtonColor(getButtonProps(button, row).type)"
                :disabled="getButtonProps(button, row).disabled"
                @click="onActionClick(button, row)"
              >
                <span>{{ resolveButtonText(button, row) }}</span>
              </MaxButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, isRef, unref } from 'vue'
import MaxButton from '@/components/MaxButton.vue'
import type {
  TableActionPayload,
  TableButton,
  TableButtonProps,
  TableColumn
} from './types'

interface MaxTableProps {
  data: Row[]
  columns: TableColumn<Row>[]
  buttons?: TableButton<Row>[]
  rowKey?: keyof Row | string
}

const props = withDefaults(defineProps<MaxTableProps>(), {
  buttons: () => [],
  rowKey: 'id'
})

const emit = defineEmits<{
  action: [payload: TableActionPayload<Row>]
  clickAction: [payload: { button: TableButton<Row>; row: Row }]
}>()

const hasOperation = computed(() => props.buttons.length > 0)

const resolveRowKey = (row: Row, index: number) => {
  return row[props.rowKey as keyof Row] ?? index
}

const getColumnStyle = (column: TableColumn<Row>) => {
  return {
    width: column.width || 'auto'
  }
}

const getCellValue = (row: Row, column: TableColumn<Row>) => {
  return row[column.prop as string]
}

const formatDate = (raw: any) => {
  if (!raw) return '-'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('zh-CN', { hour12: false })
}

const resolveFieldProps = (row: Row, column: TableColumn<Row>) => {
  const value = getCellValue(row, column)
  if (typeof column.fieldProps === 'function') {
    return column.fieldProps(value, row) || {}
  }
  return column.fieldProps || {}
}

const renderCellText = (row: Row, column: TableColumn<Row>, index: number) => {
  const value = getCellValue(row, column)

  if (column.render) {
    return column.render(value, row, index)
  }

  if (column.valueType === 'date-picker') {
    return formatDate(value)
  }

  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}

const renderSelectLabel = (row: Row, column: TableColumn<Row>) => {
  const value = getCellValue(row, column)
  const option = column.options?.find((item) => item.value === value)
  return option?.label || '-'
}

const renderTagText = (row: Row, column: TableColumn<Row>) => {
  const value = getCellValue(row, column)
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  return String(value)
}

const getTagClass = (row: Row, column: TableColumn<Row>) => {
  const fieldProps = resolveFieldProps(row, column)
  const type = fieldProps.type || 'default'
  return `tag-${type}`
}

const getSelectTextStyle = (row: Row, column: TableColumn<Row>) => {
  const value = getCellValue(row, column)
  const option = column.options?.find((item) => item.value === value)
  if (!option?.color) {
    return {}
  }

  const colorMap: Record<string, string> = {
    red: '#dc2626',
    blue: '#2563eb',
    yellow: '#ca8a04',
    green: '#16a34a'
  }

  return {
    color: colorMap[option.color] || option.color,
    fontWeight: 600
  }
}

const getImageStyle = (
  value: any,
  row: Row,
  column: TableColumn<Row>
) => {
  void value
  const fieldProps = resolveFieldProps(row, column)
  return {
    width: fieldProps.width || '44px',
    height: fieldProps.height || '44px',
    borderRadius: fieldProps.radius || '12px'
  }
}

const resolveShow = (button: TableButton<Row>, row: Row) => {
  if (button.show === undefined) return true
  if (typeof button.show === 'function') {
    return button.show(row)
  }
  if (isRef(button.show)) {
    return !!unref(button.show)
  }
  return !!button.show
}

const getVisibleButtons = (row: Row) => {
  return props.buttons.filter((button) => resolveShow(button, row))
}

const buttonColorMap: Record<string, string> = {
  default: '#6b7280',
  primary: '#3b82f6',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#f59e0b',
  info: '#0ea5e9'
}

const buttonHeightMap: Record<string, number> = {
  small: 12,
  medium: 13,
  large: 14
}

const getButtonColor = (type: string) => {
  return buttonColorMap[type] || buttonColorMap.default
}

const getButtonHeight = (size: string) => {
  return buttonHeightMap[size] || buttonHeightMap.small
}

const resolveButtonIcon = (button: TableButton<Row>) => {
  return typeof button.icon === 'string' ? button.icon : undefined
}

const resolveButtonText = (button: TableButton<Row>, row: Row) => {
  if (typeof button.text === 'function') {
    return button.text(row)
  }
  return button.text
}

const getButtonProps = (
  button: TableButton<Row>,
  row: Row
): Required<TableButtonProps> => {
  const defaults: Required<TableButtonProps> = {
    type: 'default',
    disabled: false,
    plain: false,
    size: 'small'
  }

  if (!button.props) return defaults

  let result: TableButtonProps
  if (typeof button.props === 'function') {
    result = button.props(row)
  } else if (isRef(button.props)) {
    result = unref(button.props)
  } else {
    result = button.props
  }

  return {
    ...defaults,
    ...result
  }
}

const onActionClick = async (button: TableButton<Row>, row: Row) => {
  const btnProps = getButtonProps(button, row)
  if (btnProps.disabled) return

  if (button.confirm) {
    const title =
      button.confirm.title ||
      (button.confirm.options?.title as string | undefined) ||
      '操作确认'
    const message =
      button.confirm.message ||
      (button.confirm.options?.message as string | undefined) ||
      '确定执行该操作吗？'
    const ok = window.confirm(`${title}\n${message}`)
    if (!ok) return
  }

  const payload: TableActionPayload<Row> = {
    code: button.code,
    row,
    button
  }

  emit('action', payload)
  emit('clickAction', { button, row })
}
</script>

<style scoped lang="less">
.max-table {
  --card-bg: var(--surface-color);
  --line: var(--line-color);
  --head-bg: color-mix(in srgb, var(--panel-color) 58%, transparent);
  --text-main: var(--text-color);
  --text-muted: var(--text-muted);
  --shadow: 0 16px 38px var(--shadow-color);

  background: var(--surface-color);
  padding: 16px;
  border-radius: 18px;
}

.table-shell {
  border-radius: 14px;
  overflow: auto;
  background: var(--card-bg);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  color: var(--text-main);
  font-size: 14px;
}

th {
  background: var(--head-bg);
  font-weight: 600;
}

tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color 0.22s ease;
}

tbody tr:hover {
  background: color-mix(in srgb, var(--panel-color) 40%, transparent);
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

.operation-head,
.operation-cell {
  width: 220px;
}

.operation-cell {
  white-space: normal;
}

.empty-cell {
  padding: 52px 16px;
  text-align: center;
  color: var(--text-muted);
}

.table-image {
  display: inline-block;
  object-fit: cover;
  border: 1px solid var(--line);
}

.muted {
  color: var(--text-muted);
}

.table-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
}

.tag-default {
  color: #475467;
  background: #f2f4f7;
  border-color: #d0d5dd;
}

.tag-success {
  color: #027a48;
  background: #ecfdf3;
  border-color: #abefc6;
}

.tag-warning {
  color: #b54708;
  background: #fff4ed;
  border-color: #ffd6ae;
}

.tag-danger {
  color: #b42318;
  background: #fef3f2;
  border-color: #fecdca;
}

.tag-primary {
  color: #175cd3;
  background: #eff8ff;
  border-color: #b2ddff;
}

.table-button {
  display: inline-block;
  margin: 4px 6px 4px 0;
}

.btn-small {
  :deep(.button-container) {
    min-height: 30px;
    padding: 7px 12px;
  }
}

.btn-medium {
  :deep(.button-container) {
    min-height: 34px;
    padding: 8px 14px;
  }
}

.btn-large {
  :deep(.button-container) {
    min-height: 38px;
    padding: 9px 16px;
  }
}

.table-button.is-plain {
  :deep(.button-container) {
    background-color: transparent !important;
  }
}

@media (max-width: 920px) {
  .max-table {
    padding: 10px;
  }

  th,
  td {
    padding: 12px 10px;
    font-size: 13px;
  }

  .operation-head,
  .operation-cell {
    width: 190px;
  }

  .table-button {
    margin-right: 4px;
  }
}
</style>
