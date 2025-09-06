<script lang="ts">
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import type { Transaction } from '$types/forms'
  import SavingsRow from './SavingsRow.svelte'

  type Props = {
    transactions: Transaction[]
  }

  const { transactions }: Props = $props()

  const totalIncome = $derived(
    transactions
      .filter((tr) => tr.type === 'Income')
      .reduce((total, current) => (total += current.amount ?? 0), 0),
  )
</script>

<div class="Card">
  <div class="Card-header">
    <p class="text-sm leading-[16px] font-medium">Сводка</p>
  </div>

  <div class="flex flex-col">
    <div class="Summary-block">
      <p class="Summary-row">
        <span>Доход</span>
        <span class="font-medium text-green-600">+224 763 ₽</span>
      </p>

      <p class="Summary-row">
        <span>Расходы</span>
        <span class="font-medium text-red-600">-211 021 ₽</span>
      </p>

      <p class="Summary-row Summary-rowSmall">
        <span>плановые</span>
        <span class="text-red-600">169 360 ₽</span>
      </p>

      <p class="Summary-row Summary-rowSmall">
        <span>повседневные</span>
        <span class="text-red-600">41 661 ₽</span>
      </p>
    </div>

    <hr class="text-gray-200" />

    <div class="Summary-block">
      <SavingsRow label="Сбережения" value={0} {totalIncome} />
      <SavingsRow label="Инвестиции" value={0} {totalIncome} />
    </div>

    <hr class="text-gray-200" />

    <div class="Summary-block">
      <p class="Summary-row">
        <span>Остаток дохода</span>
        <span class="font-medium text-green-600">13 742 ₽</span>
      </p>

      <p class="Summary-row">
        <span>Дней до следующего дохода</span>
        <NumberInput
          mode="normal"
          classes={{ input: 'h-6! w-auto! min-w-12 field-sizing-content' }}
          value={10}
          placeholder="0"
        />
      </p>
    </div>
  </div>

  <div class="Card-footer flex-col items-start! gap-0!">
    <p class="text-xs leading-[20px] opacity-70">
      Рекомендуется оставить хотя бы 9 162 ₽ на следующий месяц
    </p>

    <p class="flex w-full items-center justify-between text-xs leading-[20px] opacity-70">
      <span>Дневной бюджет</span>
      <span>916 ₽</span>
    </p>
  </div>
</div>
