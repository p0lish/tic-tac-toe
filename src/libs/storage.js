export default {
  loadItem: function (key) {
    let item = JSON.parse(window.localStorage.getItem(key))
    return item
  },

  saveItem: function (key, data) {
    let item = JSON.stringify(data)
    window.localStorage.setItem(key, item)
  }
}
