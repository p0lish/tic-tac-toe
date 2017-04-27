<template>
    <div>
        <div class="scoreBoard">
            <span> O: {{ stats.O }} (you)</span>
            <h2>SCORE</h2>
            <span>X: {{ stats.X }} (bot) </span>
        </div>
        <div id="app">
            <div id="details">
                <h1>Tic Tac Toe</h1>
                <h2>Match #{{ matches + 1 }}</h2>
            </div>
            <board></board>
            <button class="restart" @click="restart">{{ actionText }}</button>
        </div>
        <div class="modal" v-if="isPreviousSessionPresent">
            <div class="change-game">
                <h2> Do you want to restore the previous session or begin a new game?</h2>
                <button class="restore" @click="continueGame()">Continue</button>
                <button class="new-game" @click="newGame()">Start new game
                </button>
            </div>
        </div>

    </div>
</template>
<script>
  import Board from './components/Board.vue'
  import storage from './libs/storage'

  export default {
    components: {Board},
    storage: [storage],
    name: 'app',
    data () {
      return {
        actionText: 'Restart',
        isGameModeSelected: false,
        konami: [],
        matches: 0,
        stats: {
          O: 0,
          X: 0
        }
      }
    },
    computed: {

      /** Check if previous game session available, then it's possible to choose  the previous session, or
       *  a new session.
       * @returns {boolean}
       **/

      isPreviousSessionPresent () {
        let storageIsPresent = (storage.loadItem('boardState')) || (storage.loadItem('appData'))
        return storageIsPresent && !this.isGameModeSelected
      }
    },

    mounted () {
      /**
       * Check local storage is available in browser
       */

      if (typeof (Storage) === 'undefined') {
        window.alert('Your game state cannot be saved because local storage is not supported')
      }
    },
    created: function () {
      window.addEventListener('keyup', this.konamicode)
      window.Event.$on('win', (winner) => {
        this.stats[winner]++
        this.gameStatus = 'endgame'
        this.actionText = 'New game'
        storage.saveItem('appData', this.$data)
      })
      window.Event.$on('loadPreviousState', () => {
        if (storage.loadItem('appData') !== null) {
          let savedAppState = storage.loadItem('appData')
          Object.assign(this.$data, savedAppState)
        }
      })
    },
    methods: {
      restart () {
        if (this.gameStatus === 'endgame') {
          this.gameStatus = 'ongame'
          this.actionText = 'Restart'
        }
        this.matches++
        window.Event.$emit('clear')
        window.Event.$emit('resetBoard')
        window.Event.$emit('startRandomPlayer')
        storage.saveItem('appData', this.$data)
      },
      konamicode (e) {
        let keyPattern = 'u,u,d,d,l,r,l,r,b,a'
        if (this.konami.length === 10) {
          this.konami = []
        }
        if (e.key === 'ArrowUp') {
          this.konami.push('u')
        }
        if (e.key === 'ArrowDown') {
          this.konami.push('d')
        }
        if (e.key === 'ArrowRight') {
          this.konami.push('r')
        }
        if (e.key === 'ArrowLeft') {
          this.konami.push('l')
        }
        if (e.key.toLowerCase() === 'b') {
          this.konami.push('b')
        }
        if (e.key.toLowerCase() === 'a') {
          this.konami.push('a')
        }
        if (this.konami.join() === keyPattern) {
          this.gatesAreOpen()
        }
      },
      gatesAreOpen () {
        let win = window.open(window.atob('aHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvWC1jZldNMEJDXzQ/YXV0b3BsYXk9MQ=='), '_blank')
        win.focus()
      },
      continueGame () {
        this.isGameModeSelected = true
        window.Event.$emit('loadPreviousState')
      },
      newGame () {
        window.localStorage.clear()
        window.Event.$emit('startRandomPlayer')
        this.isGameModeSelected = true
      }
    }
  }
</script>
<style lang="scss">
    body {
        background-color: #fafafa;
        color: #fff;
        font-family: Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        margin: 0;
    }

    #app {
        margin: 0 auto;
        max-width: 270px;
        color: #34495e;
    }

    h1 {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 3em;
    }

    .restart {
        background-color: #e74c3c;
        color: #fff;
        border: 0;
        font-family: Helvetica, sans-serif;
        font-size: 1.4em;
        font-weight: bold;
        margin: 0;
        padding: 15px;
        width: 100%;
    }

    .restore {
        background-color: #e74c3c;
        color: #fff;
        border: 0;
        font-family: Helvetica, sans-serif;
        font-size: 1.4em;
        font-weight: bold;
        margin: 0;
        padding: 10px;
    }

    .restore:hover {
        background-color: #c0392b;
    }

    .new-game {
        background-color: #16a085;
        color: #fff;
        border: 0;
        font-family: Helvetica, sans-serif;
        font-size: 1.4em;
        font-weight: bold;
        margin: 0;
        padding: 10px;
    }

    .new-game:hover {
        background-color: #1b8f6f;
    }

    .change-game {
        color: #000;
        background: #fff;
        border: 1px solid #000;
        margin: auto;
        padding: 20px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 0);
    }

    .restart:hover {
        background-color: #c0392b;
        cursor: pointer;
    }

    .scoreBoard {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 15px;
        background-color: #16a085;
        padding: 20px;
    }

    .scoreBoard h2 {
        margin: 0;
    }

    .scoreBoard span {
        font-weight: bold;
    }

    .modal {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }
</style>
