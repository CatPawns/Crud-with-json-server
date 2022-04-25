<script>
import { faker } from '@faker-js/faker';

export default {
  name: 'AddMenu',
  data() {
    return {
      productId: '',
      productName: '',
      productPrice: '',
      loaded: false,
      iName: '',
      iDesc: '',
      createdItem: { name: '', desc: '' },
    };
  },
  emits: ['response'],
  methods: {
    onSubmit() {
      this.createdItem.name = this.iName;
      this.createdItem.desc = this.iDesc;
      this.iName = '';
      this.iDesc = '';
      this.$emit('response', this.createdItem);
    },
    dorandom() {
      this.createdItem.name = this.iName = faker.name.firstName();
      this.createdItem.desc = this.iDesc = faker.name.jobTitle();
      this.$emit('response', this.createdItem);
    },
  },
};
</script>
<template>

  <div class="products">
    <div class="card">
      <div class="card-header text-white bg-info mb-2">Add Item</div>

      <div class="card-body">
        <form class="row g-3" v-on:submit.prevent="onSubmit">
          <div class="col-auto">
            <input
              v-model="iName"
              type="text"
              class="form-control"
              id="staticEmail2"
              placeholder="Item"
              required
              autocomplete="off"
            />
          </div>
          <div class="col-auto">
            <input
              v-model="iDesc"
              class="form-control"
              id="inputPassword2"
              placeholder="Description"
              required
              autocomplete="off"
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary mb-3">Submit</button>
          </div>
        </form>
        <div class="col-auto">
          <button @click="dorandom()" class="btn btn-primary mb-3">
            Add random entry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
}
.icon {
  margin-right: 10px;
}
.icon i {
  cursor: pointer;
}
</style>
