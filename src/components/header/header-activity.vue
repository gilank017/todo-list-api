<template lang="pug">
.todo-header.d-flex.justify-content-between
  .activity-title(data-cy="activity-title") Activity
  button.btn.activity-add-button(data-cy="activity-add-button" @click="addActivity()")
    span.mr-2.fa.fa-solid.fa-plus
    span Tambah
</template>
<script>
import axios from '@/plugins/axios'
import Swal from 'sweetalert2'
export default {
  methods: {
    async addActivity() {
      const body = {
        title: "New Activity",
        email: "gilang@mail.com"
      }
      const response = await axios.post("/activity-groups", body)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
          return error.response.data
      })
      if (response.status) {
        Swal.fire({
          html:'<div style="text-align: left; display:flex; align-items:center;"><div data-cy="modal-information-icon" class="fa fa-exclamation-circle" style="font-size: 26px; color: #00A790;"></div> <div <div data-cy="modal-information-title" style="font-size:18px; line-height:21px; font-weight: 500; margin-left: 10px;">   Activity Berhasil Ditambahkan</div></div>',
          showConfirmButton: false,
          timer: 1000
        })
        this.$emit('refreshData')
      }
    }
  }
}
</script>
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