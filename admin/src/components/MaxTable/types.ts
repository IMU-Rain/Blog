import type { Component, ComputedRef, Ref } from 'vue'

export type AlignType = 'left' | 'center' | 'right'

export type TableButtonType =
  | 'default'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'

export type TableValueType = 'text' | 'date-picker' | 'image' | 'select' | 'tag'

export type DynamicValue<T, Row> =
  | T
  | ((row: Row) => T)
  | Ref<T>
  | ComputedRef<T>

export interface TableButtonProps {
  type?: TableButtonType
  disabled?: boolean
  plain?: boolean
  size?: 'small' | 'medium' | 'large'
}

export interface TableButtonConfirm {
  title?: string
  message?: string
  options?: ({
    title?: string
    message?: string
  } & Record<string, unknown>)
}

export interface TableButton<Row = Record<string, any>> {
  text: string | ((row: Row) => string)
  code: string
  icon?: string | Component
  props?: DynamicValue<TableButtonProps, Row>
  show?: boolean | ((row: Row) => boolean) | Ref<boolean> | ComputedRef<boolean>
  confirm?: TableButtonConfirm
}

export interface TableSelectOption {
  label: string
  value: string | number
  color?: string
}

export interface TableColumn<Row = Record<string, any>> {
  label: string
  prop: keyof Row | string
  width?: string
  align?: AlignType
  valueType?: TableValueType
  options?: TableSelectOption[]
  fieldProps?:
    | Record<string, any>
    | ((value: any, row: Row) => Record<string, any>)
  render?: (value: any, row: Row, index: number) => string | number
}

export interface TableActionPayload<Row = Record<string, any>> {
  code: string
  row: Row
  button: TableButton<Row>
}

export type PlusColumn<Row = Record<string, any>> = TableColumn<Row>
