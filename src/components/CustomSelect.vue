<template>
  <button class="booking-form__select-button custom-select">{{ title }}</button>
  <transition name="slideDown">
    <div class="booking-form__select-dropdown custom-select__dropdown">
      <div class="custom-select__option-wrap"
           v-for="(option, index) in options" :key="index">
        <input class="custom-select__option"
               :id="option.id"
               :value="option.id"
               type="radio"
               :name="name"
               @change="passValue(option.id)">
        <label :for="option.id">
          {{ option.title }}
        </label>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CustomSelect",
  props: {
    title: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    modelValue: String,
  },
  emits: ['update:modelValue'],
  methods: {
    passValue(id) {
      this.$emit('update:modelValue', id)
    }
  },
  data() {
    return {
      selectedData: '',
    }
  }
}
</script>