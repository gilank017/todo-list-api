<template lang="pug">
.activity-page-wrapper
  header-page
  .container
    header-activity(@refreshData="getListActivity")
    div(v-if="listActivity.length === 0")
      img.img-fluid(data-cy="activity-empty-state" src="../assets/img/activity-empty-state.svg")
    .activity-content-list(v-else)
      .row
        .col-lg-3.col-md-6(v-for="(activity, index) in listActivity" :key="index")
          .card.activity-card(data-cy="activity-item")
            .activity-body(@click="toDetail(activity.id)")
              h4.activity-title(data-cy="activity-item-title") {{ activity.title }}
            .card-footer.text-muted
              span.activity-date(data-cy="activity-item-date") {{ parseDate(activity.created_at) }}
              span.fa.fa-trash-o.icon-style(data-cy="activity-item-delete-button" @click="deleteModalOpen(activity)")
#activity-delete.modal.fade(role="dialog" aria-hidden="true")
  .modal-dialog.modal-dialog-centered(data-cy="todo-modal-delete" role="document")
    .modal-content
      .modal-header
        .modal-title.pt-4
          img(src="../assets/img/icon-alert.svg" data-cy="modal-delete-icon")
      .modal-body.pl-3.pr-3
        p Apakah anda yakin menghapus activity <strong> {{ deleteActivity.title }} </strong> ?
      .modal-footer.pb-4
        button.btn.btn-cancel(data-cy="modal-delete-cancel-button" @click="deleteModalClose()") Batal
        button.btn.btn-confirm(data-cy="modal-delete-confirm-button" @click="activityDelete()") Hapus
</template>
<script>
import headerPage from '../components/header/header-page.vue'
import headerActivity from '../components/header/header-activity.vue'
import axios from '@/plugins/axios'
import moment from 'moment'
import $ from 'jquery'
import Swal from 'sweetalert2'
export default {
  components: {
    headerPage,
    headerActivity,
  },
  data() {
    return {
      mail: "gilang@mail.com",
      listActivity: [],
      deleteActivity: {}
    }
  },
  mounted() {
    this.getListActivity()
  },
  methods: {
    async getListActivity() {
      const response = await axios.get("/activity-groups", {
        params: {
          email: this.mail
        }
      })
      .then((res) => {
        return res.data
      })
      if (response.status) {
        this.listActivity = response.data
      }
    },
    deleteModalOpen(dataActivity) {
      $('#activity-delete').modal('show')
      this.deleteActivity = dataActivity
    },
    deleteModalClose() {
      $('#activity-delete').modal('hide')
      this.deleteActivity = {}
    },
    parseDate(date) {
      return moment(date).locale('id').format("LL")
    },
    async activityDelete() {
      const response = await axios.delete(`/activity-groups/${this.deleteActivity.id}`)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
          return error.response.data
      })
      if (response.status === 'Success') {
        this.deleteModalClose()
        Swal.fire({
          html:'<div style="text-align: left; display:flex; align-items:center;"><div data-cy="modal-information-icon" class="fa fa-exclamation-circle" style="font-size: 26px; color: #00A790;"></div> <div data-cy="modal-information-title" style="font-size:18px; line-height:21px; font-weight: 500; margin-left: 10px;">   Activity Berhasil Dihapus</div></div>',
          showConfirmButton: false,
          timer: 1000
        })
        this.getListActivity()
      }
    },
    toDetail(id) {
      this.$router.push({
        path: `/detail/${id}`
      })
    }
  }
  
}
</script>
<style lang="sass" scoped>
.activity-card
  border-radius: 12px
  height: 234px
  padding: 27px
  margin-bottom: 26px
  box-shadow: 0 4px 8px #dfdfdf
  .activity-body
    cursor: pointer
    height: 158px
    .activity-title
      font-weight: 700
      text-align: left
      font-size: 18px
  .card-footer
    position: absolute
    z-index: 2
    bottom:  25px
    background-color: #fff
    display: flex
    justify-content: space-between
    align-items: center
    border: 0
    width: calc(100% - 54px)
    padding: 0
    .activity-date
      font-size: 14px
      font-weight: 500
    .icon-style
      font-size: 22px
      cursor: pointer
.modal-header
  border: 0
  display: flex
  justify-content: center
  align-items: center
.modal-footer
  display: flex
  justify-content: center
  border: 0
.btn
  width: 150px
  margin: 0 10px
  background-color: #F4F4F4
  border-radius: 45px
  padding: 13.5px 29px
  font-weight: 600
  font-size: 18px
.btn-cancel
  background-color: #F4F4F4
.btn-confirm
  background-color: #ED4C5C
  color: #fff
</style>