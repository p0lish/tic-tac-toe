export default {
  move: function (cellNumber) {
    document.querySelector('td[name="' + cellNumber + '"]').click()
  },
  calculateMove: function (table) {
    let emptycells = []
    for (var key in table) {
      if (table[key] === '') {
        emptycells.push(key)
      }
    }

    let nextMove = emptycells[Math.floor(Math.random() * emptycells.length)]
    return nextMove
  }
}
