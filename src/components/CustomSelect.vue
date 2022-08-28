<template>
  <button type="button"
          class="booking-form__select-button custom-select"
          :class="{'custom-select--disabled' : disabled === true }"
          @click.self="showDropdown()"
          :disabled="disabled === true">
    {{ selectTitle }}

    <transition name="fade">
      <div class="booking-form__select-dropdown custom-select__dropdown"
           :class="{'custom-select__dropdown--hidden' : !dropDownOpen}"
           v-if="dropDownOpen">
        <div class="custom-select__option-wrap"
             v-for="(option, index) in options" :key="index">
          <input class="custom-select__option"
                 :id="option.id"
                 :value="option.title"
                 type="radio"
                 :name="name"
                 @change="passValue(option.id)"
                 v-model="selectTitle"
                 hidden>
          <label :for="option.id">
            {{ option.title }}
          </label>
        </div>
      </div>
    </transition>
  </button>

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
    modelValue: {
      type: String
    },
    disabled: {
      type: Boolean,
    },
    buttonTitle: {
      type: String
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedData: '',
      dropDownOpen: false,
      selectTitle: 'this.buttonTitle'
    }
  },
  methods: {
    passValue(id) {
      this.$emit('update:modelValue', id)
      this.showDropdown();
    },
    showDropdown() {
        this.dropDownOpen = !this.dropDownOpen;
    },
  },
}
</script>
