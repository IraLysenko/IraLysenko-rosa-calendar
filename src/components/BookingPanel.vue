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
                   v-model="this.firstVisit"
                   hidden>
            <label class="booking-form__radio-label" :for="'radioVisit' + input.id">{{ input.title }}</label>
          </div>
        </div>

      </div>

      <div class="booking-form__section booking-form__section--select" v-if="firstVisit !== null">
        <span class="booking-form__option-title">{{ this.fields.patient_motive_title }}</span>
        <CustomSelect
            :title = "this.fields.patient_motive_button"
            :button-title = "this.fields.select_motive_title"
            :options = "this.fields.motives"
            :disabled = "this.firstVisit === null"
            name = "motive"
            v-model="this.selectedReason">
        </CustomSelect>
      </div>

      <div class="booking-form__section booking-form__section--select">
        <span class="booking-form__option-title">{{ this.fields.chose_location_title }}</span>
        <CustomSelect
            :title = "this.fields.chose_location_title"
            :button-title="this.fields.locations[0].title"
            :options = "this.fields.locations"
            :disabled = "this.firstVisit === null && this.selectedReason.length === 0 "
            name = "location"
            v-model="this.selectedLocation">
        </CustomSelect>
      </div>

      <DateTable
          :availabilities = "availabilities"
          :start-date = "startDate"
          :visible-days = "fields.data_picker_days_amount"
          :next-available-date="nextAvailableDate"
          :meeting-duration="meetingDuration"
          :time-rows-default="fields.data_picker_rows_default"
          @to-next-week="goToNextWeek"
          @to-next-availabilities="goToNextAvailabilities"
          @to-prev-availabilities="goToPrevAvailabilities"
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
      firstVisit: null,
      selectedReason: '',
      selectedLocation: '',
      selectedDate: '',
      fields: fields,
      availabilities: [],
      startDate: moment(),
      nextAvailableDate : '',
      availableDate: '',
      selectedTime: null,
      fieldsData: {
        firstVisit: null,
        selectedReason: {
          id : '',
          title: ''
        },
        selectedLocation: {
          id : '',
          title: ''
        },
        selectedDate: {
          date : '',
          time: ''
        },
      },
      validation: {
        firstVisit: false,
        selectedReason: false,
        selectedLocation: false,
        selectedDate: false,
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
        motive_id: vm.selectedReason,
        is_new_patient: vm.firstVisit,
        calendar_ids: vm.selectedLocation,
      });
    },

    meetingDuration() {
      if(!this.selectedReason) {
        return '';
      } else {
        let currentMotiveObj = this.fields.motives.find(motive => motive.id === this.selectedReason );
        return currentMotiveObj.meeting_duration;
      }
    },
  },
  watch: {
    queryParams() {
      if(this.firstVisit && this.selectedReason && this.selectedLocation){
        this.getData();
      }
    },
  },
  methods: {
    handleSubmit() {
      alert(this.selectedTime);
      console.log('submit');
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
      let nextWeekStartDate = moment(this.startDate).startOf('day').toISOString();
      console.debug("neeeext   " + nextWeekStartDate);
    },

    goToPrevAvailabilities(){
      console.debug("preeev");
    }
  },

  mounted() {
    if(this.firstVisit && this.selectedReason && this.selectedLocation) {
      this.getData();
    }
  },
}

</script>