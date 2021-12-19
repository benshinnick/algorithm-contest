export function getQuicksortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    quicksort(array, 0, array.length - 1, animations);
    return animations;
}

function quicksort(array, lowIndex, highIndex, animations) {
    if (lowIndex >= highIndex) {
        return;
    }
    
    let lowEndIndex = quicksortPartition(array, lowIndex, highIndex, animations);

    quicksort(array, lowIndex, lowEndIndex, animations);
    quicksort(array, lowEndIndex + 1, highIndex, animations);
}

function quicksortPartition(array, lowIndex, highIndex, animations) {
    // Animation codes:
    //  'p' denotes that a pivot was chosen
    //  'c' denotes a comparison between the pivot
    //  'cf' denotes that a comparison is finished
    //  's' denotes a swap between two indexes
    //  'sf' denotes a swap is finished

    let pivotIndex = Math.floor(lowIndex + (highIndex - lowIndex) / 2);
    let pivot = array[pivotIndex];
    animations.push(['p', lowIndex, highIndex, array[pivotIndex]]);
    
    let done = false;
    while(!done) {

        while (array[lowIndex] < pivot) {
            animations.push(['c', lowIndex, pivotIndex]);
            animations.push(['cf', lowIndex, pivotIndex]);
            lowIndex++;
        }
    
        while (pivot < array[highIndex]) {
            animations.push(['c', highIndex, pivotIndex]);
            animations.push(['cf', highIndex, pivotIndex]);
            highIndex--;
        }

        if (lowIndex >= highIndex) {
            animations.push(['c', highIndex, pivotIndex]);
            animations.push(['cf', highIndex, pivotIndex]);
            done = true;
        }

        else {
            animations.push(['s', lowIndex, highIndex, array[lowIndex], array[highIndex]]);
            swap(array, lowIndex, highIndex);
            animations.push(['sf', lowIndex, highIndex, array[lowIndex], array[highIndex]]);
            lowIndex++;
            highIndex--;
        }
    }
    
    return highIndex;
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}