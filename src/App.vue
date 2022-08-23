<template>
  <main class="booking-page">
    <div class="booking-page__container container">
      <section class="booking-page__info">
      </section>
      <aside class="booking-page__panel">
        <BookingPanel></BookingPanel>
      </aside>
    </div>
  </main>
</template>

<script>
import BookingPanel from './components/BookingPanel.vue'

export default {
  name: 'App',
  components: {
    BookingPanel
  }
}
</script>
