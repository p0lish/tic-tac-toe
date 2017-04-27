<template>
    <td class="cell" :name="name" @click="check">{{ content }}</td>
</template>

<script>
  export default {
    props: ['name'],
    data () {
      return {
        disabled: false,
        content: ''
      }
    },
    methods: {
      check () {
        if (!this.disabled) {
          window.Event.$emit('check', this.name)
          this.content = this.$parent.cells[this.name]
          this.disabled = true
        }
      }
    },
    created () {
      window.Event.$on('clear', () => {
        this.content = ''
        this.disabled = false
      })

      window.Event.$on('disable', () => {
        this.disabled = true
      })

      window.Event.$on('loadPreviousState', () => {
        this.content = this.$parent.cells[this.name]
      })
    }
  }
</script>

<style>
    .cell {
        width: 33.333%;
        height: 90px;
        border: 6px solid #2c3e50;
        font-size: 3.5em;
    }


</style>
