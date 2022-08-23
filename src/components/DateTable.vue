<template>
  <table class="booking-form__date-picker date-picker">
    <tr class="date-picker__row date-picker__row--header">
      <th class="date-picker__nav date-picker__nav--left">
        <span class="arrow-icon">+</span>
      </th>

      <th class="date-picker__cell date-picker__cell--heading">
        <div class="date-picker__day">Sun</div>
        <div class="date-picker__date">
          <span class="date-picker__month">Aug</span>
          <span class="date-picker__date"> 22</span>
        </div>
      </th>

      <th class="date-picker__cell date-picker__cell--heading">
        <div class="date-picker__day">Sun</div>
        <div class="date-picker__date">
          <span class="date-picker__month">Aug</span>
          <span class="date-picker__date"> 22</span>
        </div>
      </th>

      <th class="date-picker__nav date-picker__nav--right">
        <span class="arrow-icon">+</span>
      </th>
    </tr>
    <tr class="date-picker__row">
      <td class="date-picker__nav date-picker__nav--empty"></td>

      <td class="date-picker__cell date-picker__time">
        <span class="date-picker__time-span">09:30</span>
      </td>
      <td class="date-picker__cell date-picker__time date-picker__time--empty">
        <span class="date-picker__time-empty"></span>
      </td>

      <td class="date-picker__nav date-picker__nav--empty"></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "DateTable",
  props: {
    timeData: Object
  },
}
</script>