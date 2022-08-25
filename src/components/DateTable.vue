<template>

  <table class="booking-form__date-picker date-picker" >
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
          {{ day.startTime? timeCounter(day.startTime, day.duration, rowIndex) : "---"}}

        </span>
      </td>

<!--      <td class="date-picker__cell date-picker__time date-picker__time&#45;&#45;empty" >-->
<!--        <span class="date-picker__time-empty"></span>-->
<!--      </td>-->

      <td class="date-picker__nav date-picker__nav--empty"></td>
    </tr>
  </table>

  <button type="button" class="button button--next-data" v-if="nextAvailableDate" @click="$emit('to-next-week')">
    Next available date {{ formattedNextAvailableDate }}
  </button>

  <!--  <button class="data-picker__show-more">Show more availabilities</button>-->
</template>

<script>
import moment from "moment/moment";

export default {
  name: "DateTable",
  emits: ['toNextWeek'],
  props: {
    availabilities: Array,
    startDate: [String],
    visibleDays: String,
    nextAvailableDate: String,
    meetingDuration: String,
  },
  data() {
    return {
      rowsDefault: 3,
    }
  },
  computed: {
    formattedNextAvailableDate: vm => vm.nextAvailableDate && moment(vm.nextAvailableDate).format('MMM DD'),

    dataPickerArr() {
      const datePickerData = [];
      const currentDate = moment(this.startDate);
      const endDate = moment(currentDate).add(6, 'days');

      console.debug(currentDate);

      for (let date = currentDate; date <= endDate; date.add(1, 'days')) {
        const dayData = this.availabilities ? this.availabilities.find(day => {
          // console.debug(date);
          // console.debug(day.startAt);
          // console.debug(day.endAt);
          // console.debug(moment(date).isBetween(day.startAt, day.endAt, 'day'));
          return moment(date).isBetween(moment(day.startAt).subtract(1, 'days'), day.endAt);
        }) : {};

        const dayObj = {
          dateFull: date.format('Y-MM-D'),
          weekday: date.format('ddd'),
          month: date.format('MMM'),
          number: date.format('D'),
          startTime: dayData?.startAt,
          endTime: dayData?.endAt,
          duration: dayData?.duration,
          motiveId: dayData?.motiveIds
        }
        datePickerData.push(dayObj);
      }
      return datePickerData
    },
  },

  methods: {
    timeCounter(startTime, duration, rowIndex) {
      console.log(startTime, duration, rowIndex);
      let index = this.meetingDuration * rowIndex;
      if(index <= duration) {
        return moment(startTime).add(index, 'minutes').format('HH:mm');
      }
    }
  },
}
</script>