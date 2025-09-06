<script lang="ts">
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import type { Transaction } from '$types/forms'
  import { getDaysUntilNextMonth } from '$utils/dates'

  type Props = {
    transactions: Transaction[]
  }

  const { transactions }: Props = $props()
  let daysToIncome = $state<number>(10)
  const daysLeft = getDaysUntilNextMonth()

  const formatter = new Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
  })

  const getSumOfType = (type: Transaction['type']): number =>
    transactions
      .filter((tr) => tr.type === type)
      .reduce((total, current) => (total += current.amount ?? 0), 0)

  const getPercentage = (partialValue: number, totalValue: number) => {
    return totalValue !== 0 ? Math.round((100 * partialValue) / totalValue) : 0
  }

  const totalIncome = getSumOfType('Income')
  const regularExpenses = getSumOfType('Expense')
  const mandatoryExpenses = getSumOfType('ExpensePlanned')
  const savingsAmount = getSumOfType('Savings')
  const savingsPercentage = getPercentage(savingsAmount, totalIncome)
  const investmentsAmount = getSumOfType('Investment')
  const investmentsPercentage = getPercentage(investmentsAmount, totalIncome)
  const netAmount = $derived(
    totalIncome - (regularExpenses + mandatoryExpenses + savingsAmount + investmentsAmount),
  )

  const totalDaysLeft = $derived(daysToIncome + daysLeft)
  const dailyBudget = $derived(netAmount / (totalDaysLeft > 0 ? totalDaysLeft : 1))
</script>

<div class="Card">
  <div class="Card-header">
    <p class="text-sm leading-[16px] font-medium">Сводка</p>
  </div>

  <div class="flex flex-col">
    <div class="Summary-block">
      <p class="Summary-row">
        <span>Доход</span>
        <span class="font-medium text-green-600">+{formatter.format(totalIncome)} ₽</span>
      </p>

      <p class="Summary-row">
        <span>Расходы</span>
        <span class="font-medium text-red-600">
          -{formatter.format(regularExpenses + mandatoryExpenses)} ₽
        </span>
      </p>

      <p class="Summary-row Summary-rowSmall">
        <span>повседневные</span>
        <span class="text-red-600">{formatter.format(regularExpenses)} ₽</span>
      </p>

      <p class="Summary-row Summary-rowSmall">
        <span>плановые</span>
        <span class="text-red-600">{formatter.format(mandatoryExpenses)} ₽</span>
      </p>
    </div>

    <hr class="text-gray-200" />

    <div class="Summary-block">
      <p class="Summary-row">
        <span>Сбережения</span>
        <span class="flex items-center gap-1 font-medium">
          <span class="text-xs text-slate-500">{savingsPercentage}%</span>
          <span class="pb-[2px] text-[10px] leading-2 text-slate-500">&bull;</span>
          {formatter.format(savingsAmount)} ₽
        </span>
      </p>

      <p class="Summary-row">
        <span>Инвестиции</span>
        <span class="flex items-center gap-1 font-medium">
          <span class="text-xs text-slate-500">{investmentsPercentage}%</span>
          <span class="pb-[2px] text-[10px] leading-2 text-slate-500">&bull;</span>
          {formatter.format(investmentsAmount)} ₽
        </span>
      </p>
    </div>

    <hr class="text-gray-200" />

    <div class="Summary-block">
      <p class="Summary-row">
        <span>Остаток дохода</span>
        <span class="font-medium text-green-600">{formatter.format(netAmount)} ₽</span>
      </p>

      <p class="Summary-row">
        <span>Дней до следующего дохода</span>
        <NumberInput
          bind:value={daysToIncome}
          mode="normal"
          classes={{ input: 'h-6! w-auto! min-w-12 field-sizing-content' }}
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
      <span>~{formatter.format(dailyBudget)} ₽</span>
    </p>
  </div>
</div>
