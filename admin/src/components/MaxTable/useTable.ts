import { ref, shallowRef } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import type { TableButton } from './types'

type RowRecord = Record<string, any>

type RowFromInput<T> = T extends (infer R)[] ? R : T
type DataFromInput<T> = T extends any[] ? T : T[]

export interface UseTableResult<T extends RowRecord | RowRecord[]> {
  tableData: Ref<DataFromInput<T>>
  buttons: ShallowRef<TableButton<RowFromInput<T>>[]>
}

export const useTable = <T extends RowRecord | RowRecord[]>(
  initialData: DataFromInput<T> = [] as DataFromInput<T>,
  initialButtons: TableButton<RowFromInput<T>>[] = []
): UseTableResult<T> => {
  const tableData = ref<DataFromInput<T>>(initialData)
  const buttons = shallowRef<TableButton<RowFromInput<T>>[]>(initialButtons)

  return {
    tableData,
    buttons
  }
}
