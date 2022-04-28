<script>
import { Toast } from 'bootstrap';

export default {
  name: 'BootstrapToast',
  data() {
    return {
      toast: null,
    };
  },
  mounted() {
    this.toast = new Toast(this.$refs.el);
    this.toast.show();
  },
};
</script>
<template>
  <div
    ref="el"
    class="alert alert-danger alert-dismissible fade show"
    role="alert"
  >
    <div>{{ message }}</div>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button>
  </div>
</template>
