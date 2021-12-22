export function getHeapSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    heapSort(array, animations);
    return animations;
}

function heapSort(array, animations) {
    buildMaxHeap(array, animations);

    let lastElementIndex = array.length - 1;

    while(lastElementIndex > 0) {
        animations.push(['s', 0, lastElementIndex]);
        animations.push(['sf', 0, lastElementIndex, array[0], array[lastElementIndex]]);
        swap(array, 0, lastElementIndex);
        maxHeapify(array, 0, lastElementIndex, animations);
        lastElementIndex--;
    }
}

function buildMaxHeap(array, animations) {
    let length = array.length;
    let middle = Math.floor(array.length / 2 - 1);
    let i = middle;

    while(i >= 0) {
        maxHeapify(array, i, length, animations);
        i--;
    }
}

function maxHeapify(array, i, maxIndex, animations) {
    // Animation codes:
    //  'c' denotes a comparison between the pivot
    //  'cf' denotes that a comparison is finished
    //  's' denotes a swap between two indexes
    //  'sf' denotes a swap is finished

    let index;
    let leftChild;
    let rightChild;

    while(i < maxIndex) {
        index = i;

        leftChild = i * 2 + 1;
        rightChild = leftChild + 1;

        if(leftChild < maxIndex) {
            animations.push(['c', leftChild, index]);
            animations.push(['cf', leftChild, index]);
        }
        if(leftChild < maxIndex && array[leftChild] > array[index]) {
            index = leftChild;
        }
        
        if(rightChild < maxIndex) {
            animations.push(['c', leftChild, index]);
            animations.push(['cf', leftChild, index]);
        }
        if(rightChild < maxIndex && array[rightChild] > array[index]) {
            animations.push(['c', rightChild, index]);
            animations.push(['cf', rightChild, index]);
            index = rightChild;
        }

        if(index === i) {
            return;
        }
        else {
            animations.push(['s', i, index]);
            animations.push(['sf', i, index, array[i], array[index]]);
            swap(array, i, index);
            i = index;
        }

    }

}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}