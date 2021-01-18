class Node {
  constructor(val, next = null) {
    this.val = val;
    this.next = next
  }
}

export default class LinkedList {

  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToBack(val) {
    const newest = new Node(val);
    if (this.tail == null) {
      this.head = newest;
      this.tail = newest; 
    }
    else {
      this.tail.next = newest;
      this.tail = newest;
    }
  }

  removeFirst() {
    if (this.head == null) {
      return null;
    }
    if(this.head.val === this.tail.val) {
      const val = this.head;
      this.head = null;
      this.tail = null;
      return val;
    }
    else {
      const val = this.head;
      this.head = this.head.next;
      return val;
    }
  }

  getFirst() {
    return this.head != null ? this.head.val : null
  }
}

