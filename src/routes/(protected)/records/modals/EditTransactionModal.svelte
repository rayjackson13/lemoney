<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import { categories } from '$stores/categories'
  import { editTransaction } from '$stores/editTransaction'
  import { transactionTypes } from '$stores/transactionTypes'
  import type { Transaction } from '$types/forms'
  import { parseDateFromISOString } from '$utils/dates'
  import { FirebaseController } from '$utils/FirebaseController'
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

    if (!transaction || !validate(transaction) || isSubmitting) return

    try {
      isSubmitting = true
      FirebaseController.updateTransaction(transaction.id, transaction)
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
    <form class="Card md:min-w-100! w-full! md:w-auto! mx-4" onsubmit={onSubmit}>
      <div class="Card-header items-center justify-between">
        <p class="font-medium leading-[16px] md:text-sm">Редактирование транзакции</p>

        <button
          type="button"
          class="IconButton opacity-100! hover:opacity-70! active:opacity-20!"
          aria-label="Закрыть окно"
          onclick={closeModal}
        >
          <i class="fas fa-close w-4! leading-4! h-4 md:text-sm"></i>
        </button>
      </div>

      <div
        class="max-h-90 flex flex-col gap-2 overflow-y-auto overflow-x-hidden py-4 md:gap-1 md:py-2"
      >
        <div
          class="AddRecordForm-recordRow flex flex-col items-center gap-2 px-4 md:flex-row md:gap-1"
        >
          <DatePicker bind:value={transaction.date} classes={{ root: 'w-full md:w-auto' }} />

          <Autocomplete
            classes={{ root: 'w-full md:flex-1 md:w-auto' }}
            options={transactionTypes}
            placeholder="Тип"
            bind:value={transaction.type}
          />

          <NumberInput
            placeholder="0"
            maxValue={999_999_999}
            classes={{
              input: 'AddRecordForm-amountInput max-sm:w-full!',
              root: 'w-full md:w-auto',
            }}
            bind:value={transaction.amount}
          />
        </div>

        <div
          class="AddRecordForm-recordRow flex flex-col items-center gap-2 px-4 md:flex-row md:gap-1"
        >
          <input
            class="Input w-full md:w-auto md:flex-1"
            type="text"
            placeholder="Описание"
            bind:value={transaction.description}
          />

          {#if !transaction.type || ['Expense', 'ExpensePlanned'].includes(transaction.type)}
            <Autocomplete
              classes={{ root: 'w-full md:w-45' }}
              options={$categories}
              placeholder="Категория"
              bind:value={transaction.category}
            />
          {/if}
        </div>
      </div>

      <div class="Card-footer Card-footer--noGutters">
        <div class="flex w-full items-center justify-center gap-2 md:justify-end md:px-4">
          <span class="Hotkey hidden md:block">Ctrl+Enter</span>

          <button class="Card-footerButton" disabled={isSubmitting} type="submit">
            <i class="fas fa-check"></i>
            <span>Сохранить</span>
          </button>
        </div>
      </div>
    </form>
  </div>
{/if}
