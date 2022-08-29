<template>
  <div class="booking-panel">
    <h2 class="booking-panel__title">{{ this.fields.booking_panel_title }}</h2>
    <form class="booking-form" @submit.prevent="handleSubmit">
      <div class="booking-form__section booking-form__section--visit">
        <span class="booking-form__option-title">{{ this.fields.is_new_patient_title }}</span>

        <div class="booking-form__radio-wrapper">
          <div class="booking-form__input-wrap"
               v-for="(input, index) in this.fields.visit"
               :key="index" >
            <input type="radio"
                   :id="'radioVisit' + input.id"
                   name="radioVisit"
                   :value="input.is_new_patient"
                   v-model="selectedData.firstVisit"
                   hidden>
            <label class="booking-form__radio-label" :for="'radioVisit' + input.id">{{ input.title }}</label>
          </div>
        </div>

      </div>

      <div class="booking-form__section booking-form__section--select" v-if="selectedData.firstVisit !== null">
        <span class="booking-form__option-title">{{ this.fields.patient_motive_title }}</span>
        <CustomSelect
            :title = "this.fields.patient_motive_button"
            :button-title = "this.fields.select_motive_title"
            :options = "this.fields.motives"
            :disabled = "this.selectedData.firstVisit === null"
            name = "motive"
            v-model="selectedData.selectedReason">
        </CustomSelect>
      </div>

      <div class="booking-form__section booking-form__section--select">
        <span class="booking-form__option-title">{{ this.fields.chose_location_title }}</span>
        <CustomSelect
            :title = "this.fields.chose_location_title"
            :button-title="this.fields.locations[0].title"
            :options = "this.fields.locations"
            :disabled = "this.selectedData.firstVisit === null && this.selectedData.selectedReason.length === 0 "
            name = "location"
            v-model="selectedData.selectedLocation">
        </CustomSelect>
      </div>

      <DateTable
          :availabilities = "availabilities"
          :start-date = "startDate"
          :visible-days = "fields.data_picker_days_amount"
          :next-available-date="nextAvailableDate"
          :meeting-duration="meetingDuration"
          :time-rows-default="fields.data_picker_rows_default"
          :date-picker-available="datePickerAvailable"
          @to-next-week="goToNextWeek"
          @to-next-availabilities="goToNextAvailabilities"
          @to-prev-availabilities="goToPrevAvailabilities"
          @send-day-data="sendDayData"
      >
      </DateTable>

      <div class="booking-form__submit">
        <button type="submit"
                class="booking-form__button button button--primary">
          <span>{{ this.fields.submit_button_text }}</span>
          <i class="button__icon button__icon--right-array fa fa-arrow-right"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import CustomSelect from './CustomSelect.vue'
import DateTable from './DateTable.vue'
import fields from '../../data/db.json'
import moment from 'moment'
import axiosInstance from "@/utils/http-client";

export default {
  name: "BookingPanel",
  components: {
    CustomSelect,
    DateTable,
  },
  data() {
    return {
      fields: fields,
      availabilities: [],
      startDate: moment(),
      nextAvailableDate : '',
      availableDate: '',
      selectedData: {
        firstVisit: null,
        selectedReason: '',
        selectedLocation: '',
        selectedDate: {},
      },
    }
  },
  computed: {
    queryParams: vm => {
      const currentDate = moment(vm.startDate).startOf('day').toISOString();
      const endDate = moment(currentDate).add(fields.data_picker_days_amount, 'days').endOf('day').toISOString();

      return ({
        from: currentDate,
        to: endDate,
        motive_id: vm.selectedData.selectedReason.id,
        is_new_patient: vm.selectedData.firstVisit,
        calendar_ids: vm.selectedData.selectedLocation.id,
      });
    },

    meetingDuration() {
      if(!this.selectedData.selectedReason) {
        return '';
      } else {
        const currentMotiveObj = this.fields.motives.find(motive => motive.id === this.selectedData.selectedReason.id );
        return currentMotiveObj.meeting_duration;
      }
    },
    validationParams() {
      return ({
        firstVisit: this.selectedData.firstVisit !== null ,
        selectedReason: !!this.selectedData.selectedReason,
        selectedLocation: !!this.selectedData.selectedLocation,
        selectedDate: !!this.selectedData.selectedLocation,
      });
    },
    datePickerAvailable() {
      if(this.validationParams.firstVisit !== null
        && this.validationParams.selectedReason === true
        && this.validationParams.selectedLocation) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    queryParams() {
      if(this.selectedData.firstVisit && this.selectedData.selectedReason && this.selectedData.selectedLocation){
        this.getData();
      }
    },
  },
  methods: {
    handleSubmit() {
      alert(this.selectedData.selectedDate.date + ' at ' + this.selectedData.selectedDate.time);
      console.log(this.selectedData);
    },

    async getData() {
      /**
       * @type {{startAt: string, endAt: string, duration: string, motiveIds: string[], calendarId: string }[]}
       */
      this.availabilities = (await axiosInstance.get('/availabilities', {params: this.queryParams})).data;
      if (this.availabilities.length === 0) {
        const {to, motive_id, calendar_ids, is_new_patient} = this.queryParams;

        const params = {
          from: to,
          motive_id,
          calendar_ids,
          is_new_patient,
        };

        const data = await (await axiosInstance.get('/availabilities/next', {params})).data;
        this.nextAvailableDate = data?.startAt;
      }
    },

    goToNextWeek() {
      this.startDate = this.nextAvailableDate;
      this.nextAvailableDate = null;
    },

    goToNextAvailabilities() {
      this.startDate = moment(this.startDate).add(fields.data_picker_days_amount, 'days');
    },

    goToPrevAvailabilities(){
      if(this.startDate > moment()) {
        this.startDate = moment(this.startDate).subtract(fields.data_picker_days_amount, 'days');
      }
    },

    sendDayData(dayData, selectedTime) {
      this.selectedData.selectedDate.date = dayData.weekday + ', ' + dayData.number + ' ' + dayData.month + ' '+ dayData.year;
      this.selectedData.selectedDate.time = selectedTime;
    }
  },

  mounted() {
    if(this.selectedData.firstVisit && this.selectedData.selectedReason && this.selectedData.selectedLocation) {
      this.getData();
    }
  },
}

</script>