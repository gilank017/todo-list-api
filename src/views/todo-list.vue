<template lang="pug">
.list-page-wrapper
  header-page
  .container
    .todo-header.d-flex.justify-content-between
      .d-flex.align-items-center
        span.fa.fa-chevron-left.back-style.mr-4.pointer(data-cy="todo-back-button" @click="goBack()")
        .todo-title(v-if="!editTitle" data-cy="todo-title") {{ detailActivity.title }}
        div(v-else)
          input.form-control.form-control-custom(data-cy="todo-edit-title" type="text" v-model="detailActivity.title")
        span.fa.fa-pencil.back-style.pointer.ml-3.text-muted(v-if="!editTitle" data-cy="todo-title-edit-button" @click="toggleTitleActivity()")
        span.fa.fa-floppy-o.back-style.pointer.ml-3.text-muted(v-if="editTitle" data-cy="todo-title-save-button" @click="submitTitle()")
      button.btn.todo-add-button(data-cy="todo-add-button" @click="openModalTodo()")
        span.mr-2.fa.fa-solid.fa-plus
        span Tambah
    div(v-if="todoList.length === 0")
      img.img-fluid(data-cy="todo-empty-state" src="../assets/img/todo-empty-state.svg")
    .todo-content-list(v-else)
      .todo-item(v-for="(todo, index) in todoList" :key="index")
        .form-check
          input.form-check-input.form-check-custom(data-cy="todo-item-checkbox" type="checkbox" v-model="todo.is_active" @change="updateStatus(todo)")
          span.fa.fa-circle.icon-style(data-cy="todo-item-priority-indicator" :class="todo.priority")
          .todo-item-title(:class="todo.is_active ? 'text-active text-muted': ''" data-cy="todo-item-title") {{ todo.title }}
          span.fa.fa-pencil.edit-style.text-muted.pointer(data-cy="todo-item-edit-button" @click="openModalTodo(todo)")
        span.fa.fa-trash-o.delete-style(data-cy="todo-item-delete-button")
#todo.modal.fade(role="dialog" aria-hidden="true")
  .modal-dialog.modal-lg.modal-dialog-centered(data-cy="todo-modal-delete" role="document")
    .modal-content
      .modal-header
        .modal-title(data-cy="modal-add-title") {{ state }} List Item
        button(type="button" class="close" aria-label="close" @click="closeModalTodo()")
          span(aria-hidden="true") &times;
      .modal-body
        div.form-input.mb-4
          .label-form
            label(data-cy="modal-add-name-title") NAMA LIST ITEM
          input.form-control.form-control-md(data-cy="modal-add-name-input" placeholder="Tambahkan nama Activity" v-model="formActivity.title")
        div.form-input
          .label-form
            label(data-cy="modal-add-priority-title") Priority
            .row
              .col-5
                select.select-activity.form-control(v-model="formActivity.priority")
                  option(data-cy="modal-add-priority-item" value="very-high" data-icon="fa fa-circle very-high" selected) Very High
                  option(data-cy="modal-add-priority-item" value="high" data-icon="fa fa-circle high") High
                  option(data-cy="modal-add-priority-item" value="medium" data-icon="fa fa-circle medium") Medium
                  option(data-cy="modal-add-priority-item" value="low" data-icon="fa fa-circle low") Low
                  option(data-cy="modal-add-priority-item" value="very-low" data-icon="fa fa-circle very-low") Very Low
      .modal-footer.pb-4
        button.btn.todo-add-button(@click="state ==='Tambah' ? createTodo() : updateTodo()") Simpan

</template>
<script>
import axios from '@/plugins/axios'
import headerPage from '../components/header/header-page.vue'
import $ from 'jquery'
import Swal from 'sweetalert2'
export default {
  components: {
    headerPage
  },
  data() {
    return {
      formActivity: {},
      detailActivity: {},
      todoList: [],
      state: 'Tambah',
      editTitle: false
    }
  },
  mounted() {
    this.getDetailActivity()
    this.getTodoList()
    this.initSelect()
  },
  methods: {
    toggleTitleActivity() {
      this.editTitle = !this.editTitle
    },
    initSelect() {
      $('.select-activity').selectpicker('val', 'very-high')
    },
    async getDetailActivity() {
      const response = await axios.get(`/activity-groups/${this.$route.params.id}`)
      .then((res) => {
        return res.data
      })
      if (response.status) {
        this.detailActivity = response.data
      }
    },
    async getTodoList() {
      const response = await axios.get(`todo-items`, {params:{
        activity_group_id: this.$route.params.id
      }})
      .then((res) => {
        return res.data
      })
      if (response.status) {
        this.todoList = response.data
        for (let i = 0; i < this.todoList.length; i++) {
          if (this.todoList[i].is_active === "1") {
            this.todoList[i].is_active = true
          }
          if (this.todoList[i].is_active === "0") {
            this.todoList[i].is_active = false
          }
        }
        
      }
    },
    openModalTodo(dataTodo) {
      $('#todo').modal('show')
      if (dataTodo !== undefined) {
        this.state = "Update"
        this.formActivity = dataTodo
        $('.select-activity').selectpicker('val', dataTodo.priority)
      } else {
        this.formActivity = {}
        this.state = "Tambah"
        $('.select-activity').selectpicker('val', 'very-high')
      }
    },
    closeModalTodo() {
      $('#todo').modal('hide')
      this.formActivity = {}
    },
    async createTodo() {
      const body = {
        activity_group_id: this.$route.params.id,
        title: this.formActivity.title,
        priority: this.formActivity.priority
      }
      const response = await axios.post("/todo-items", body)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
          return error.response.data
      })
      if (response.status) {
        Swal.fire({
          html:'<div style="text-align: left; display:flex; align-items:center;"><div data-cy="modal-information-icon" class="fa fa-exclamation-circle" style="font-size: 26px; color: #00A790;"></div> <div data-cy="modal-information-title" style="font-size:18px; line-height:21px; font-weight: 500; margin-left: 10px;">Activity List Berhasil Ditambahkan</div></div>',
          showConfirmButton: false,
          timer: 1000
        })
        this.getTodoList()
        this.closeModalTodo()
      } 
    },
    async updateStatus(dataTodo) {
      this.formActivity = dataTodo
      const body = {
        is_active: this.formActivity.is_active ? "1" : "0"
      }
      const response = await axios.patch(`/todo-items/${dataTodo.id}`, body)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
          return error.response.data
      })
      if (response.status) {
        Swal.fire({
          html:'<div style="text-align: left; display:flex; align-items:center;"><div data-cy="modal-information-icon" class="fa fa-exclamation-circle" style="font-size: 26px; color: #00A790;"></div> <div data-cy="modal-information-title" style="font-size:18px; line-height:21px; font-weight: 500; margin-left: 10px;"> Status Activity Telah Diubah</div></div>',
          showConfirmButton: false,
          timer: 1000
        })
        this.getTodoList()
      }
    },
    async updateTodo() {
      const body = {
        title: this.formActivity.title,
        priority: this.formActivity.priority,
      }
      const response = await axios.patch(`/todo-items/${this.formActivity.id}`, body)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
          return error.response.data
      })
      if (response.status) {
        Swal.fire({
          html:'<div style="text-align: left; display:flex; align-items:center;"><div data-cy="modal-information-icon" class="fa fa-exclamation-circle" style="font-size: 26px; color: #00A790;"></div> <div data-cy="modal-information-title" style="font-size:18px; line-height:21px; font-weight: 500; margin-left: 10px;"> Activity List Berhasil Diubah</div></div>',
          showConfirmButton: false,
          timer: 1000
        })
        this.closeModalTodo()
        this.getTodoList()
      }
    },
    goBack() {
      this.$router.push("/")
    },
    async submitTitle() {
      const body = {
        title: this.detailActivity.title
      }
      const response = await axios.patch(`/activity-groups/${this.$route.params.id}`, body)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
          return error.response.data
      })
      if (response.status) {
        Swal.fire({
          html:'<div style="text-align: left; display:flex; align-items:center;"><div data-cy="modal-information-icon" class="fa fa-exclamation-circle" style="font-size: 26px; color: #00A790;"></div> <div data-cy="modal-information-title" style="font-size:18px; line-height:21px; font-weight: 500; margin-left: 10px;">   Nama Activity Berhasil Diubah</div></div>',
          showConfirmButton: false,
          timer: 1000
        })
        this.getDetailActivity()
        this.editTitle = false
      }
    }
  }
}
</script>
<style lang="sass">
.todo-header
  margin: 43px 0 55px
.todo-title
  font-size: 36px
  line-height: 54px
  font-weight: 700
.todo-add-button
  font-size: 18px
  line-height: 27px
  font-weight: 600
  background-color: #16ABF8
  color: #ffff
  border-radius: 45px
  padding: 13px 21px
.todo-item
  display: flex
  justify-content: space-between
  align-items: center
  background-color: #fff
  margin-bottom: 10px
  padding: 27px 40px
  border-radius: 12px
  box-shadow: 0 4px 8px #dfdfdf
.form-check
  display: flex
  align-items: center
.form-check-custom
  width: 24px
  height: 24px
  margin-top: -1px
.icon-style
  font-size: 18px
  font-weight: 500
  margin-right: 16px
  margin-left: 20px
.edit-style
  font-size: 18px
  font-weight: 500
  margin-right: 16px
.delete-style
  font-size: 24px
.back-style
  font-size: 24px
.todo-item-title
  font-size: 18px
  font-weight: 500
  margin-right: 16px
.very-high
  color: #ED4C5C
.high
  color: #F8A541
.medium
  color: #00A790
.low
  color: #428BC1
.very-low
  color: #8942C1
.text-active
  text-decoration: line-through
.pointer
  cursor: pointer
.modal-header
  height: 70px
  padding: 24px 30px
.modal-title
  font-size: 18px
  font-weight: 500
  margin: 0
.modal-body
  padding: 38px 41px 38px 30px
.label-form
  font-size: 12px
  font-weight: 600
  text-align: left
.modal-footer
  padding: 15px 40px 19px
.form-control-custom
  border: 0
  outline: 0
  border-bottom: 2px solid #03a8f45e
  font-size: 30px
  color: #000
  background-color: #f4f4f4
</style>