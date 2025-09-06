<script lang="ts">
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'

  type Props = {
    label: string
    value: number
    totalIncome: number
  }

  const getPercentage = (value: number, max: number) =>
    max === 0 ? 0 : Math.round(((value ?? 0) / max) * 100)

  const getPercentedValue = (percent: number, max: number) =>
    Math.round((max * (percent ?? 0)) / 100)

  let { label, value = $bindable(), totalIncome }: Props = $props()
  let percentValue = $state(getPercentage(value, totalIncome))

  const onPercentInput = (newValue: number | null) => {
    value = getPercentedValue(newValue ?? 0, totalIncome)
  }

  const onValueInput = (newValue: number | null) => {
    percentValue = getPercentage(newValue ?? 0, totalIncome)
  }
</script>

<div class="Summary-row">
  <span>{label}</span>

  <span class="flex gap-1">
    <NumberInput
      bind:value={percentValue}
      maxLength={3}
      mode="percent"
      classes={{ input: 'h-6! w-auto! min-w-16 field-sizing-content' }}
      onInput={onPercentInput}
      placeholder="0"
    />
    <NumberInput
      bind:value
      mode="money"
      maxLength={6}
      classes={{ input: 'h-6! w-24!' }}
      onInput={onValueInput}
      placeholder="0"
    />
  </span>
</div>
