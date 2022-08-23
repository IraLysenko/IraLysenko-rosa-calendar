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
                     v-model="firstVisit" hidden>
              <label class="booking-form__radio-label" :for="'radioVisit' + input.id">{{ input.title }}</label>
            </div>
          </div>

      </div>

      <div class="booking-form__section booking-form__section--reason">
        <span class="booking-form__option-title">{{ this.fields.patient_motive_title }}</span>
        <CustomSelect
            :title = this.fields.patient_motive_button
            :options = this.fields.motives
            name = "motive"
            v-model="this.selectedReason">
        </CustomSelect>
      </div>

      <div class="booking-form__section booking-form__section--reason">
        <span class="booking-form__option-title">{{ this.fields.chose_location_title }}</span>
        <CustomSelect
            :title = this.fields.locations[0].title
            :options = this.fields.locations
            name = "location"
            v-model="this.selectedLocation">
        </CustomSelect>
      </div>

      <DateTable
          :time-data = this.timeData
          :visible-days = fields.data_picker_days_amount
      >
      </DateTable>

      <div class="booking-form__submit">
        <button class="booking-form__button button button--primary">
          <span>{{ this.fields.submit_button_text }}</span>
          <span class="button__icon button__icon--right-array"> +</span>
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

export default {
  name: "BookingPanel",
  components: {
    CustomSelect,
    DateTable
  },
  data() {
    return {
      firstVisit: '',
      selectedReason: '',
      selectedLocation: '',
      selectedDate: '',
      fields: fields,
      apiBaseUrl: fields.apiBase +'?',
      timeData: [],
    }
  },
  methods: {
    handleSubmit() {
      console.log('submit');
    },
    getData(){
      let getData = fetch(this.dynamicApiUrl).then(res => {
        if (res.ok) {
          return res.json()
        }
      }).then(data => {
        this.timeData = data;
      });
      return getData;
    },
  },
  computed: {
    dynamicApiUrl() {
      let currentDate = moment().format("Y-MM-D"),
          endDate = moment(currentDate).add(fields.data_picker_days_amount, 'days').format("Y-MM-D");

      let queryParameters = [
        `from=${currentDate + fields.time_from}`,
        `to=${endDate + fields.time_to}`,
        `motive_id=${this.selectedReason}`,
        `is_new_patient=${this.firstVisit}`,
        `calendar_ids=${this.selectedLocation}`,
        ];

      let url = this.apiBaseUrl + queryParameters.join('&');
      return url;
    },
  },
  mounted() {
    if(this.firstVisit && this.selectedReason && this.selectedLocation) {
      this.getData();
    }
  },
  watch: {
    dynamicApiUrl(newValue){
      if(this.firstVisit && this.selectedReason && this.selectedLocation){
        this.getData(newValue);
      }
    }
  },
}
</script>