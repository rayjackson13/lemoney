<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import { categories } from '$stores/categories'
  import { editTransaction } from '$stores/editTransaction'
  import { transactionTypes } from '$stores/transactionTypes'
  import type { Transaction } from '$types/forms'
  import { ajax } from '$utils/ajax'
  import { parseDateFromISOString } from '$utils/dates'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  let isSubmitting = $state(false)
  // eslint-disable-next-line svelte/prefer-writable-derived
  let transaction = $state($editTransaction)

  const closeModal = () => {
    editTransaction.set(null)
  }

  const keyHandler = (ev: KeyboardEvent): void => {
    if (!transaction) return

    if (ev.code === 'Escape') {
      closeModal()
    }
  }

  const validate = (tx: Transaction): boolean => {
    const date = parseDateFromISOString(tx.date)
    return !!date && tx.amount !== null
  }

  const onSubmit = async (ev?: SubmitEvent): Promise<void> => {
    ev?.preventDefault()

    console.log(transaction)
    if (!transaction || !validate(transaction) || isSubmitting) return

    try {
      isSubmitting = true
      await ajax(`transactions/${transaction.id}`, {
        method: 'PATCH',
        body: JSON.stringify(transaction),
      })
      closeModal()
    } catch (e) {
      console.error(e)
    } finally {
      isSubmitting = false
    }
  }

  onMount(() => {
    document.addEventListener('keydown', keyHandler)

    return () => {
      document.removeEventListener('keydown', keyHandler)
    }
  })

  $effect.pre(() => {
    transaction = $editTransaction
  })
</script>

{#if transaction}
  <div class="Modal-backdrop" transition:fade={{ duration: 100 }}>
    <form class="Card min-w-100!" onsubmit={onSubmit}>
      <div class="Card-header items-center justify-between">
        <p class="text-sm leading-[16px] font-medium">Редактирование транзакции</p>

        <button
          class="IconButton opacity-100! hover:opacity-70! active:opacity-20!"
          aria-label="Закрыть окно"
        >
          <i class="fas fa-close h-4 w-4! text-sm leading-4!"></i>
        </button>
      </div>

      <div class="flex max-h-90 flex-col gap-1 overflow-x-hidden overflow-y-auto py-2">
        <div class="AddRecordForm-recordRow flex items-center gap-1 px-4">
          <DatePicker bind:value={transaction.date} />

          <Autocomplete
            classes={{ root: 'flex-1' }}
            options={transactionTypes}
            placeholder="Тип"
            bind:value={transaction.type}
          />

          <NumberInput
            placeholder="0"
            classes={{ input: 'AddRecordForm-amountInput' }}
            bind:value={transaction.amount}
          />
        </div>

        <div class="AddRecordForm-recordRow flex items-center gap-1 px-4">
          <input
            class="Input flex-1"
            type="text"
            placeholder="Описание"
            bind:value={transaction.description}
          />

          {#if !transaction.type || ['Expense', 'ExpensePlanned'].includes(transaction.type)}
            <Autocomplete
              classes={{ root: 'w-45' }}
              options={$categories}
              placeholder="Категория"
              bind:value={transaction.category}
            />
          {/if}
        </div>
      </div>

      <div class="Card-footer justify-end">
        <span class="Hotkey">Ctrl+Enter</span>

        <button class="Button-dark" disabled={isSubmitting} type="submit">
          <i class="fas fa-check h-[14px] w-[14px]! text-[12px]"></i>
          <span class="pb-[1px]">Сохранить</span>
        </button>
      </div>
    </form>
  </div>
{/if}
