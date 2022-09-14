<template lang="pug">
.todo-header.d-flex.justify-content-between
  .activity-title(data-cy="activity-title") Activity
  button.btn.activity-add-button(data-cy="activity-add-button")
    span.mr-2.fa.fa-solid.fa-plus
    span Tambah
</template>
<style lang="sass" scoped>
.todo-header
  margin: 43px 0 55px
.activity-title
  font-size: 36px
  line-height: 54px
  font-weight: 700
.activity-add-button
  font-size: 18px
  line-height: 27px
  font-weight: 600
  background-color: #16ABF8
  color: #ffff
  border-radius: 45px
  padding: 13px 21px
</style>