<script>
  import { Board } from "./board";

  export let rows = 9;
  export let cols = 9;

  const board = new Board(cols, rows);
  let cells = board.cells;
  let group = 0;

  console.log(board);

  function randomize() {
    board.setRandom();
    cells = board.cells;
  }

  function clear() {
    board.clear();
    cells = board.cells;
  }

  function test() {
    board.setTest();
    cells = board.cells;
  }

  function changeColor(cell) {
    board.setCell(cell.index, (cell.color + 1) % 3 | 0);
    cells = board.cells;
  }
</script>

<style>
  .white {
    background-color: white;
    border: 2px solid white;
  }

  .black {
    background-color: black;
    border: 2px solid black;
  }

  .highlight-white {
    border: 2px solid black;
  }

  .highlight-black {
    border: 2px solid yellow;
  }

  .container {
    display: inline-grid;
    grid-template-columns: repeat(9, 64px);
    grid-template-rows: repeat(9, 64px);
    background-color: goldenrod;
    background-image: url(/images/board.svg);
  }

  .cell {
    border-radius: 50%;
    margin: 2px;
  }

  .controls {
    display: inline-grid;
    grid-template-columns: auto;
    grid-template-rows: repeat(2, auto);
  }
</style>

<div class="container">
  {#each cells as cell}
    <div
      class="cell"
      class:white={cell.isWhite}
      class:black={cell.isBlack}
      class:highlight-white={cell.isWhite && cell.group == group && group > 0}
      class:highlight-black={cell.isBlack && cell.group == group && group > 0}
      on:click={() => changeColor(cell)}
      on:mouseover={() => (group = cell.group)}>
      <!-- {cell.index} -->
    </div>
  {/each}
</div>

<div class="controls">
  <button on:click={clear}>Clear</button>
  <button on:click={randomize}>Random</button>
  <span>Group: {group}</span>
</div>
