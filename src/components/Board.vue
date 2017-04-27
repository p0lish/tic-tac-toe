<template>
    <div>
        <div class="gameStatus" :class="gameStatus">
            {{ statusMessage }}
        </div>
        <div v-show="isModalActive" class="modal"></div>
        <table class="board">
            <tr>
                <cell name="1"></cell>
                <cell name="2"></cell>
                <cell name="3"></cell>
            </tr>
            <tr>
                <cell name="4"></cell>
                <cell name="5"></cell>
                <cell name="6"></cell>
            </tr>
            <tr>
                <cell name="7"></cell>
                <cell name="8"></cell>
                <cell name="9"></cell>
            </tr>
        </table>
    </div>

</template>

<script>
  import Cell from './Cell.vue'
  import evilRobot from '../libs/robot'
  import storage from '../libs/storage'
  export default {
    evilRobot: [evilRobot],
    storage: [storage],
    components: {Cell},
    data () {
      return {

        O_player: 'O',
        X_player: 'X',
        maxPossibleMove: 9,

        // active player can be 'O' or 'X'
        activePlayer: this.O_player,

        // game possible states: 'turn', 'win', 'draw'
        gameStatus: 'turn',

        statusMessage: this.O_player + '\'s turn',

        moves: 0,

        cells: {
          1: '',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
          7: '',
          8: '',
          9: ''
        },

        winnerStates: [
          // rows
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          // cols
          [1, 4, 7],
          [2, 5, 8],
          [3, 6, 9],
          // diag
          [1, 5, 9],
          [3, 5, 7]
        ],

        isModalActive: false
      }
    },
    computed: {
      getNonActivePlayer () {
        if (this.activePlayer === this.O_player) {
          return this.X_player
        }
        return this.O_player
      }
    },
    methods: {

      /**
       * Save board state to local store
       **/
      saveState () {
        storage.saveItem('boardState', this.$data)
      },

      togglePlayer () {
        this.activePlayer = this.getNonActivePlayer
      },

      /**
       * Check if 3 in a row present
       * @returns {boolean}
       */
      checkBoard () {
        for (let i = 0; i < this.winnerStates.length; i++) {
          let ws = this.winnerStates[i]
          let cells = this.cells
          // compares 3 cell values based on the cells in the condition
          if (this.areEqual(cells[ws[0]], cells[ws[1]], cells[ws[2]])) {
            return true
          }
        }
        return false
      },

      /**
       * If checkboard is true, then onWin returns 'win'
       * @returns {string}
       */
      onWin () {
        window.Event.$emit('disable')
        window.Event.$emit('win', this.activePlayer)
        this.statusMessage = `${this.activePlayer} Wins !`
        this.isModalActive = false
        return 'win'
      },

      /**
       *  game status can be return win, draw, and turn states
       * @returns {string}
       */
      changeGameStatus () {
        if (this.checkBoard()) {
          return this.onWin()
        } else if (this.moves === this.maxPossibleMove) {
          this.isModalActive = false
          this.statusMessage = "It's a Draw"
          return 'draw'
        }
        this.statusMessage = `${this.getNonActivePlayer}'s turn`
        return 'turn'
      },

      /**
       * Helper function for check 3 in a row
       * @returns {boolean}
       */
      areEqual () {
        let len = arguments.length
        for (let i = 1; i < len; i++) {
          if (arguments[i] === '' || arguments[i] !== arguments[i - 1]) {
            return false
          }
        }
        return true
      }
    },
    created () {
      window.Event.$on('check', (cellNumber) => {
        this.isModalActive = true
        this.cells[cellNumber] = this.activePlayer
        this.moves++
        this.gameStatus = this.changeGameStatus()
        this.togglePlayer()
        if (this.activePlayer === this.X_player && this.gameStatus === 'turn') {
          setTimeout(function () {
            evilRobot.move(evilRobot.calculateMove(this.cells))
            this.isModalActive = false
          }.bind(this), 1000)
        }
        this.saveState()
      })
      window.Event.$on('resetBoard', () => {
        Object.assign(this.$data, this.$options.data())
      })
      window.Event.$on('startRandomPlayer', () => {
        let whoBegin = Math.floor((Math.random() * 10) + 1)
        if (whoBegin % 2 === 1) {
          this.togglePlayer()
          evilRobot.move(evilRobot.calculateMove(this.cells))
        }
        this.isModalActive = false
      })
      window.Event.$on('loadPreviousState', () => {
        if (storage.loadItem('boardState') !== null) {
          let savedBoardState = storage.loadItem('boardState')
          Object.assign(this.$data, savedBoardState)
          if (this.gameStatus !== 'turn') {
            window.Event.$emit('disable')
          }
        }
        this.isModalActive = false
      })
    }
  }
</script>

<style>
    .board {
        background-color: #34495e;
        color: #fff;
        width: 100%;
        border-collapse: collapse;
    }

    .modal {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }

    .gameStatus {
        margin: 0;
        padding: 15px;
        background-color: #f1c40f;
        color: #fff;
        font-size: 1.4em;
        font-weight: bold;
    }

    .turn {
        background-color: #f1c40f;
    }

    .win {
        background-color: #2ecc71;
    }

    .draw {
        background-color: #9b59b6;
    }

</style>
