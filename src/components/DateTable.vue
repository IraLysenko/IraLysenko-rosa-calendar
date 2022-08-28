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

    <tr class="date-picker__row" v-for="(row, rowIndex) in dynamicRows" :key="rowIndex" >
      <td class="date-picker__nav date-picker__nav--empty"></td>

      <td class="date-picker__cell date-picker__time"
          v-for="(day, cellIndex) in this.dataPickerArr"
          :key="cellIndex"
          :class="{'date-picker__time--empty' : !day.hours.length }">

        <span class="date-picker__time-span" v-if="day.hours.length">
          <input class="date-picker__input"
                  type="radio"
                  name="time"
                  :id="day.dateFull+'_'+rowIndex"
                  hidden >
          <label :for="day.dateFull+'_'+rowIndex">
            {{ day.hours[rowIndex] }}
          </label>
        </span>

        <span class="date-picker__time-empty" v-else></span>

      </td>

      <td class="date-picker__nav date-picker__nav--empty"></td>
    </tr>

    <button
        type="button"
        class="date-picker__no-availabilities button button--no-availabilities"
        v-if="nextAvailableDate"
        @click="$emit('to-next-week')">
      <i class="button--no-availabilities__icon fa fa-calendar-times"></i>
      <span>Next available date {{ formattedNextAvailableDate }}</span>
    </button>

    <button
        type="button"
        class="date-picker__no-availabilities button button--no-availabilities"
        v-if="!availabilities.length && !nextAvailableDate"
        disabled >
      <i class="button--no-availabilities__icon fa fa-calendar-times"></i>
      <span>These dates are not available for booking</span>
    </button>
  </table>

  <div class="booking-form__section booking-form__section--centered">
    <button
        type="button"
        class="data-picker__show-more button button--show-more"
        @click="showMoreHours()"
        v-if="dynamicRows < maxRows">
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
    meetingDuration: String,
    timeRowsDefault: String
  },
  data() {
    return {
      showMoreRows: false,
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

        const availableHoursArray = availabilitiesDayData.length ?
            availabilitiesDayData.map( partOfDay => {
              const rowsAmount = partOfDay.duration/ this.meetingDuration;
              const availableHoursOfPeriod = [];
              for (let i = 0; i < rowsAmount; i++) {
                const minutesToAdd = i * this.meetingDuration;
                const timeX = moment(partOfDay?.startAt).add(minutesToAdd, 'minutes').format('HH:mm');
                availableHoursOfPeriod.push(timeX);
              }
              return availableHoursOfPeriod;
            }).reduce(( arrX, arrY ) => [...arrX, ...arrY], []) : [];

        const durationsSum = availabilitiesDayData.length ?
            availabilitiesDayData.map(period => period.duration).reduce((x, y) => x + y, 0) : [];

        const dayObj = {
          dateFull: calendarDate.format('Y-MM-DD'),
          weekday: calendarDate.format('ddd'),
          month: calendarDate.format('MMM'),
          number: calendarDate.format('D'),
          hours: availableHoursArray,
          durationSum: durationsSum,
        }
        datePickerData.push(dayObj);
      }
      return datePickerData
    },

    maxRows() {
      if(this.availabilities.length) {
        const durations = this.dataPickerArr.map( day => day.durationSum);
        const maxDuration = Math.max(...durations);
        return Math.floor(maxDuration/this.meetingDuration);
      } else {
        return this.timeRowsDefault;
      }
    },

    dynamicRows() {
      if (this.availabilities.length && this.showMoreRows === false) {
        return this.timeRowsDefault;
      } if (this.availabilities.length && this.showMoreRows === true) {
        return this.maxRows;
      } else {
        return this.timeRowsDefault;
      }
    }
  },

  methods: {
    showMoreHours(){
      this.showMoreRows = true;
    },
  },
}
</script>