<template>
  <button type="button"
          class="booking-form__select-button custom-select"
          :class="{'custom-select--disabled' : disabled === true }"
          @click.self="showDropdown()"
          :disabled="disabled === true"
          ref="customSelect">
    {{ selectTitle ? selectTitle : buttonTitle }}
    <i class="custom-select__icon fas fa-angle-down"></i>

    <transition name="fade">
      <div class="booking-form__select-dropdown custom-select__dropdown"
           :class="{'custom-select__dropdown--hidden' : !dropDownOpen}"
           v-if="this.dropDownOpen === true">
        <div class="custom-select__option-wrap"
             v-for="(option, index) in options" :key="index">
          <input class="custom-select__option"
                 :id="option.id"
                 :value="option.title"
                 type="radio"
                 :name="name"
                 @change="passValue(option)"
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
    title: String,
    options: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    modelValue: String,
    disabled: Boolean,
    buttonTitle:String
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedData: '',
      dropDownOpen: false,
      selectTitle: ''
    }
  },
  methods: {
    passValue(obj) {
      this.$emit('update:modelValue', obj);
    },
    showDropdown() {
      this.dropDownOpen = !this.dropDownOpen;
    },
    clickOutside() {
      document.addEventListener("click", (e) => {
        let customSelectButton = this.$refs.customSelect;
        if (e.target !== customSelectButton && this.dropDownOpen === true) {
          this.dropDownOpen = false;
        }
      })
    }
  },
  mounted() {
    this.clickOutside();
  }
}
</script>
