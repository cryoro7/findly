<script setup lang="ts"></script>
<template>
  <v-footer class="px-0 footer mt-2">
    <v-row align="center" justify="center">
      <v-col style="justify-items: center" justify="center" align="center" cols="12" sm="12">
        <p class="text-body-1 mb-0 text-sm-left text-center">Allrights Reserved @{{ new Date().getFullYear() }} by PT. PLN Icon Plus</p>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style lang="scss">
.v-footer {
  position: unset;
}
footer {
  a {
    &:hover {
      color: rgb(var(--v-theme-primary)) !important;
    }
  }
}
</style>
