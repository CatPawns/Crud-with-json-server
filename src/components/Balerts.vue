<template>
  <div ref="el" class="alert alert-danger alert-dismissible fade show" role="alert">
    <div>{{ message }}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>

<script>
import { Alert } from 'bootstrap';

export default {
  name: 'BootstrapAlert',
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  created() {
    new Alert(this.$refs.el);
  },
  mounted() {
    const { el } = this.$refs;
    [
      'close',
      'closed',
    ].forEach((e) => {
      el.addEventListener(`${e}.bs.alert`, () => {
        this.$emit(e);
      });
    });
  },
};
</script>