<template>

  <table class="booking-form__date-picker date-picker" >
    <tr class="date-picker__row date-picker__row--header">
      <th class="date-picker__nav date-picker__nav--left date-picker__cell date-picker__cell--nav">
        <button type="button"
                class="button button--nav-left"
                @click="$emit('to-prev-availabilities')">
          <span class="button__icon button__icon--left">
            <i class="fa-solid fa-angle-left"></i>
          </span>
        </button>
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
        <button type="button" @click="$emit('to-next-availabilities')">
          <span class="button__icon button__icon--left">
            <i class="fa-solid fa-angle-right"></i>
          </span>
        </button>
      </th>
    </tr>

    <tr class="date-picker__row" v-for="(rows, rowIndex) in rowsDefault" :key="rowIndex" >
      <td class="date-picker__nav date-picker__nav--empty"></td>

      <td class="date-picker__cell date-picker__time"
          v-for="(day, cellIndex) in this.dataPickerArr"
          :key="cellIndex"
          :class="{'date-picker__time--empty' : !day.data.length }">

        <span class="date-picker__time-span" v-if="day.data.length">
          <input class="date-picker__input"
                  type="radio"
                  name="time"
                  :id="day.dateFull+'_'+rowIndex"
                  hidden >
          <label :for="day.dateFull+'_'+rowIndex">
            {{ timeCounter(day.data, rowIndex) }}
            {{ rowIndex }}
          </label>
        </span>

        <span class="date-picker__time-empty" v-else></span>

      </td>

      <td class="date-picker__nav date-picker__nav--empty"></td>
    </tr>

    <button
        type="button"
        class="date-picker__no-availabilities button button--no-availabilities"
        v-if="!nextAvailableDate"
        @click="$emit('to-next-week')">
      <i class="button--no-availabilities__icon fa fa-calendar-times"></i>
      <span>Next available date {{ formattedNextAvailableDate }}</span>
    </button>
  </table>

  <div class="booking-form__section booking-form__section--centered">
    <button
        type="button"
        class="data-picker__show-more button button--show-more"
        @click="showMoreTime()">
      Show more availabilities
    </button>
  </div>
</template>

<script>
import moment from "moment/moment";

export default {
  name: "DateTable",
  emits: ['toNextWeek', 'toNextAvailabilities', 'toPrevAvailabilities'],
  props: {
    availabilities: Array,
    startDate: Object,
    visibleDays: String,
    nextAvailableDate: String,
    meetingDuration: String
  },
  data() {
    return {
      rowsDefault: 10,
    }
  },
  computed: {
    formattedNextAvailableDate: vm => vm.nextAvailableDate && moment(vm.nextAvailableDate).format('MMM DD'),

    dataPickerArr: function () {
      const datePickerData = [];
      const currentDate = moment(this.startDate);
      const endDate = moment(currentDate).add(7, 'days');

      for (let calendarDate = currentDate; calendarDate <= endDate; calendarDate.add(1, 'days')) {
        const availabilitiesDayData = this.availabilities.length ?
            this.availabilities.filter(function (availabilitiesDay) {
              const availabilitiesDayDate = moment(availabilitiesDay.startAt).format('Y-MM-DD');
              const calendarDayDate = moment(calendarDate).format('Y-MM-DD');
              return availabilitiesDayDate === calendarDayDate;
            }) : {};

        //console.debug(dayData);

        const dayObj = {
          dateFull: calendarDate.format('Y-MM-DD'),
          weekday: calendarDate.format('ddd'),
          month: calendarDate.format('MMM'),
          number: calendarDate.format('D'),
          endTime: 'dayData?.endAt',
          duration: 'dayData?.duration ? dayData.duration : 0',
          motiveId: 'dayData?.motiveIds',
          data: availabilitiesDayData,
        }
        datePickerData.push(dayObj);
      }
      return datePickerData
    },
  },

  methods: {
    timeCounter: function (data, rowIndex) {
      // console.log(data, rowIndex);
      console.log('DATA LENGTH' + data.length);

      let time = data.forEach( (partOfDay) => {
        let rowsAmount = partOfDay.duration/ this.meetingDuration;
        if (rowIndex < rowsAmount) {
          let minutesToAdd = this.meetingDuration * rowIndex;
          return moment(partOfDay.startAt).add(minutesToAdd, 'minutes').format('HH:mm');
        }
      });

      return time;
    },

    showMoreTime(){
      if (this.availabilities.length) {
        let durations = this.dataPickerArr.map( day => day.duration);
        let maxDuration = Math.max(...durations);
        this.rowsDefault = maxDuration/this.meetingDuration
      }
    },
  },
}
</script>