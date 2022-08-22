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
              <input type="radio" :id="'radioVisit' + input.id" name="radioVisit" :value="input.is_new_patient" v-model="firstVisit" hidden>
              <label class="booking-form__radio-label" :for="'radioVisit' + input.id">{{ input.title }}</label>
            </div>
          </div>
      </div>

      <div class="booking-form__section booking-form__section--reason">
        <span class="booking-form__option-title">{{ this.fields.patient_motive_title }}</span>
        <select class="booking-form__select" name="reason" id="" v-model="selectedReason">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <div class="booking-form__section booking-form__section--location">
        <span class="booking-form__option-title">{{ this.fields.chose_location_title }}</span>
        <select class="booking-form__select" name="location" id="" v-model="selectedLocation">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <OptionsSelect></OptionsSelect>

      <DateTable></DateTable>

      <div class="booking-form__submit">
        <button class="booking-form__button button button--primary">
          <span>{{ this.fields.submit_button_text }}</span>
          <span class="button__icon button__icon--right-array">+</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import OptionsSelect from './OptionsSelect.vue'
import DateTable from './DateTable.vue'
import fields from '../../data/db.json'

export default {
  name: "BookingPanel",
  components: {
    OptionsSelect,
    DateTable
  },
  data() {
    return {
      visit: [],
      reasons: [],
      locations: [],
      dates: [],
      firstVisit: '',
      selectedReason: '1',
      selectedLocation: '1',
      selectedDate: '',
      fields: fields,
      apiBaseUrl: 'https://staging-api.rosa.be/api/availabilities?',
      dynamicData: [],
    }
  },
  methods: {
    handleSubmit() {
      console.log('submit');
    },
    getData(){
      return fetch(this.dynamicApiUrl).then(res => {
        if (res.ok) {
          console.log('ok')
          return res.json()
        } else {
          console.log('bad')
        }
      }).then(data => {
        this.visit = data;
      });
    },
  },
  computed: {
    // dynamicApiUrl() {
    //   let queryParameters = [
    //     `motive_id=${this.firstVisit}`,
    //     `is_new_patient=${this.selectedReason}`,
    //     `calendar_ids=${this.selectedLocation}`,
    //     ];
    //
    //
    //   let url = this.apiBaseUrl + queryParameters.join('&');
    //   return url;
    // },
  },
  mounted() {
    //this.getData();
  }
}
</script>