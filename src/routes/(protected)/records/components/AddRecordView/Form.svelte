<script lang="ts">
  import type { Transaction } from '$types/forms'
  import { onMount, tick } from 'svelte'
  import RecordRow from './Row.svelte'
  import { dateToISOString, parseDateFromISOString } from '$utils/dates'
  import { isValid } from 'date-fns'
  import { isEqual } from '$utils/isEqual'

  const getDefaultRecord = (): Transaction => ({
    amount: null,
    category: null,
    date: dateToISOString(new Date()),
    description: '',
    id: crypto.randomUUID(),
    type: 'Expense',
  })

  let records = $state<Transaction[]>([getDefaultRecord()])
  let isSubmitting = $state(false)
  let rowContainer: HTMLDivElement

  const focusLastRecord = (): void => {
    const input = rowContainer.querySelector(
      '.AddRecordForm-recordRow:last-child .AddRecordForm-amountInput',
    ) as HTMLInputElement | null

    if (input) {
      input.scrollIntoView()
      input.select()
    }
  }

  const addRecord = async (): Promise<void> => {
    records.push(getDefaultRecord())
    await tick()
    focusLastRecord()
  }

  const removeRecord = (index: number): void => {
    if (records.length > 1) {
      records.splice(index, 1)
      return
    }

    const { id } = records[0]
    records = [{ ...getDefaultRecord(), id }]
  }

  const isRowValid = (row: Transaction): boolean => {
    const date = parseDateFromISOString(row.date)
    return !!date && isValid(date) && row.amount !== null
  }

  const validate = (): Transaction[] => {
    return records.filter(isRowValid)
  }

  const isDirty = (): boolean => {
    const defaultRecord = getDefaultRecord()
    return records.some((rec) => !isEqual({ ...rec, id: '' }, { ...defaultRecord, id: '' }))
  }

  const onSubmit = async (ev?: SubmitEvent): Promise<void> => {
    ev?.preventDefault()

    const validRows = validate()
    if (!validRows.length || isSubmitting) return

    try {
      isSubmitting = true
      await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(validRows),
      })
      records = [getDefaultRecord()]
    } catch (e) {
      console.error(e)
    } finally {
      isSubmitting = false
    }
  }

  const handleShortcuts = (ev: KeyboardEvent): void => {
    if (ev.altKey && ev.code === 'KeyN') {
      ev.preventDefault()
      addRecord()
      return
    }

    if (ev.ctrlKey && ev.code === 'Enter') {
      ev.preventDefault()
      onSubmit()
    }
  }

  function onBeforeUnload(ev: BeforeUnloadEvent) {
    if (isDirty()) {
      ev.preventDefault()
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleShortcuts, true)
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      document.removeEventListener('keydown', handleShortcuts, true)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  })
</script>

<form class="Card" onsubmit={onSubmit}>
  <div class="Card-header items-center justify-between">
    <p class="text-sm leading-[16px] font-medium">Добавить транзакцию</p>

    <div class="flex items-center gap-1">
      <span class="Hotkey">Alt+N</span>
      <button class="IconButton" aria-label="Добавить строку" type="button" onclick={addRecord}>
        <i class="fas fa-plus h-4 w-4! text-sm leading-4!"></i>
      </button>
    </div>
  </div>

  <div
    bind:this={rowContainer}
    class="flex max-h-90 flex-col gap-1 overflow-x-hidden overflow-y-auto py-2"
  >
    {#each records as record, index (record.id)}
      <RecordRow bind:record={records[index]} {index} {removeRecord} />
    {/each}
  </div>

  <div class="Card-footer justify-end">
    <span class="Hotkey">Ctrl+Enter</span>

    <button class="Button-dark" disabled={isSubmitting} type="submit">
      <i class="fas fa-check h-[14px] w-[14px]! text-[12px]"></i>
      <span class="pb-[1px]">Добавить</span>
    </button>
  </div>
</form>
