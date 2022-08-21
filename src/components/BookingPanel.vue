<template>
  <div class="booking-panel">
    <h2 class="booking-panel__title">Find availability</h2>
    <form class="booking-form" @submit.prevent="handleSubmit">
      <div class="booking-form__section booking-form__section--visit">
          <span class="booking-form__option-title">Is this your first appointment with this practitioner?</span>
          <div class="booking-form__radio-wrapper">

            <div class="booking-form__input-wrap">
              <input type="radio" id="visitYes" name="visit-yes" value="Yes" v-model="selectedVisit" hidden>
              <label class="booking-form__radio-label" for="visitYes">Yes</label>
            </div>

            <div class="booking-form__input-wrap">
              <input type="radio" id="visitNo" name="visit-no" value="No" v-model="selectedVisit" hidden>
              <label class="booking-form__radio-label" for="visitNo">No</label>
            </div>
          </div>
      </div>

      <div class="booking-form__section booking-form__section--reason">
        <span class="booking-form__option-title">What is the reason for your visit?</span>
        <select class="booking-form__select" name="reason" id="" v-model="selectedReason">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <div class="booking-form__section booking-form__section--location">
        <span class="booking-form__option-title">Select a location and an available time</span>
        <select class="booking-form__select" name="location" id="" v-model="selectedLocation">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <OptionsSelect></OptionsSelect>

      <DateTable></DateTable>

    </form>
  </div>
</template>

<script>
import OptionsSelect from './OptionsSelect.vue'
import DateTable from './DateTable.vue'

export default {
  name: "BookingPanel",
  components: {
    OptionsSelect,
    DateTable
  },
  data() {
    return {
      visit: [
        'yes',
        'no'
      ],
      reasons: [],
      locations: [],
      dates: [],
      selectedVisit: '',
      selectedReason: '1',
      selectedLocation: '1',
      selectedDate: '',
    }
  },
  methods: {
    handleSubmit() {
      console.log('submit');
    }
  }
}
</script>

<style scoped>

</style>