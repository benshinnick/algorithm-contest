// Referenced: https://www.digitalocean.com/community/tutorials/js-binary-heaps
// Used in the A*, Dijkstra, and Greedy Best First algorithms to determine what
//  the next node to visit is. The order that the value was added is used
//  as the secondary priority to break any ties in priority

export class PriorityQueue {

    constructor() {
        this.values = [];
    }

    enqueue(val, priority, secondaryPriority) {
        let newNode = new Node(val, priority, secondaryPriority);
        this.values.push(newNode);
        let index = this.values.length - 1;
        const current = this.values[index];
    
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.values[parentIndex];
    
            if (this.enquePrioritize(parent, current)) {
                this.values[parentIndex] = current;
                this.values[index] = parent;
                index = parentIndex;
            } else break;
        }
    }

    dequeue() {
        if(this.values.length <= 1) {
            return this.values.pop();
        }

        const max = this.values[0];
        const end = this.values.pop();
        this.values[0] = end;
    
        let index = 0;
        const length = this.values.length;
        const current = this.values[0];
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;
    
            if (leftChildIndex < length) {
                leftChild = this.values[leftChildIndex];
                if (this.dequePrioritize(leftChild, current)) swap = leftChildIndex;
            }
            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                if (
                    (swap === null && this.dequePrioritize(rightChild, current)) ||
                    (swap !== null && this.dequePrioritize(rightChild, leftChild))
                )
                    swap = rightChildIndex;
            }
  
            if (swap === null) break;
            this.values[index] = this.values[swap];
            this.values[swap] = current;
            index = swap;
        }
        return max;
    }

    enquePrioritize(val1, val2) {
        return val1.priority === val2.priority
            ? val1.secondaryPriority > val2.secondaryPriority
            : val1.priority > val2.priority;
    }

    dequePrioritize(val1, val2) {
        return val1.priority === val2.priority
        ? val1.secondaryPriority < val2.secondaryPriority
        : val1.priority < val2.priority;
    }

    isEmpty() {
        if(this.values.length <= 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

class Node {
    constructor(val, priority, secondaryPriority) {
      this.val = val;
      this.priority = priority;
      this.secondaryPriority = secondaryPriority;
    }

    getValue() {
        return this.val;
    }
}