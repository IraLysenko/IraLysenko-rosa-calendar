<template>
  <table class="booking-form__date-picker date-picker" v-if="timeData.length" >
    <tr class="date-picker__row date-picker__row--header">
      <th class="date-picker__nav date-picker__nav--left">
        <span class="arrow-icon">+</span>
      </th>

      <th class="date-picker__cell date-picker__cell--heading"
        v-for="(day, index) in this.dataPickerArr" :key="index">
        <div class="date-picker__day">{{ day.weekday }}</div>
        <div class="date-picker__date">
          <span class="date-picker__month">{{ day.month + " "}}</span>
          <span class="date-picker__date">{{day.number}}</span>
        </div>
      </th>

      <th class="date-picker__nav date-picker__nav--right">
        <span class="arrow-icon">+</span>
      </th>
    </tr>

    <tr class="date-picker__row" v-for="(rows, rowIndex) in rowsDefault" :key="rowIndex" >
      <td class="date-picker__nav date-picker__nav--empty"></td>

      <td class="date-picker__cell date-picker__time"
          v-for="(day, cellIndex) in this.dataPickerArr" :key="cellIndex">
        <span class="date-picker__time-span">
          {{ day.startTime? timeCounter(day.startTime, day.endTime, rowIndex) : "---"}}
        </span>
      </td>

<!--      <td class="date-picker__cell date-picker__time date-picker__time&#45;&#45;empty" >-->
<!--        <span class="date-picker__time-empty"></span>-->
<!--      </td>-->

      <td class="date-picker__nav date-picker__nav--empty"></td>
    </tr>
  </table>

<!--  <button class="data-picker__show-more">Show more availabilities</button>-->
</template>

<script>
import moment from "moment/moment";

export default {
  name: "DateTable",
  props: {
    timeData: Array,
    visibleDays: String,
  },
  data() {
    return {
      dataPickerArr: [],
      rowsDefault: 30,
    }
  },
  methods: {
    dataPickerCreateArr() {
      const currentDate = moment(),
            endDate = moment(currentDate).add(6, 'days');

      for (let date = currentDate; date <= endDate; date.add(1, 'days')) {
        let dayData = this.timeData ? this.timeData.find(day => day['startAt'].includes(date.format('Y-MM-D'))) : [];

        let dayObj = {
          dateFull: date.format('Y-MM-D'),
          weekday: date.format('ddd'),
          month: date.format('MMM'),
          number: date.format('D'),
          startTime: dayData ? dayData["startAt"] : "",
          endTime: dayData ? dayData["endAt"] : "",
          duration: dayData ? dayData.duration : "",
        }

        this.dataPickerArr.push(dayObj);
      }
    },

    timeCounter(startTime, endTime, rowIndex) {
      let time1 = moment(startTime).add(15 * rowIndex, 'minutes').format('LT')
      return time1;
    }
  },

  watch: {
    timeData(newArr) {
      if(!newArr.length) return;
      this.dataPickerCreateArr(newArr);
    }
  },

}
</script>