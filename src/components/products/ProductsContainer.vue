<template>
  <div class="products">
    <el-row 
      type="flex" 
      justify="space-around">
      <el-col :span="16">
        <el-card :body-style="{position: 'relative', height: '495px', overflowX: 'hidden'}">
          <el-switch 
            v-model="tableView" 
            active-text="Расширенный" 
            inactive-text="Простой" 
            inactive-color="#409EFF" 
            class="products-switch"/>
          <transition 
            name="fade" 
            mode="out-in">
            <products-list 
              v-if="tableView" 
              :products="products"/>
            <products-selector 
              v-else 
              :products="products"/>
          </transition>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card
          :body-style="{height: '495px'}">
          <products-menu/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProductsSelector from './ProductsSelector.vue';
import ProductsMenu from './menu/ProductsMenu.vue';

export default {
  components: {
    ProductsSelector,
    ProductsMenu,
    ProductsList: () => import('./ProductsList.vue'),
  },
  data() {
    return {
      tableView: false,
    };
  },
  computed: {
    products() {
      return this.$store.getters.products;
    },
  },
};
</script>

<style lang="scss" scoped>
.products {
  &-switch {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 1;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
