import { jsTPS_Transaction } from "jstps";

/**
 * CopySong_Transaction
 *
 * This class represents a transaction that copies/duplicates a song
 * in the playlist. It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 */
export default class CopySong_Transaction extends jsTPS_Transaction {
  constructor(initStore, initIndex, initSong) {
    super();
    this.store = initStore;
    this.index = initIndex;
    this.song = initSong;
  }

  executeDo() {
    this.store.createSong(this.index + 1, this.song);
  }

  executeUndo() {
    this.store.removeSong(this.index + 1);
  }
}
