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

    // I choose a value at a valid random index to serve as our pivot value
    let pivotIndex = randomIntFromInterval(lowIndex, highIndex);
    let pivot = array[pivotIndex];
    animations.push(['p', lowIndex, highIndex, pivot]);
    
    let done = false;
    while(!done) {

        while (array[lowIndex] < pivot) {
            animations.push(['c', lowIndex]);
            animations.push(['cf', lowIndex]);
            lowIndex++;
        }
    
        while (pivot < array[highIndex]) {
            animations.push(['c', highIndex]);
            animations.push(['cf', highIndex]);
            highIndex--;
        }

        if (lowIndex >= highIndex) {
            animations.push(['c', highIndex]);
            animations.push(['cf', highIndex]);
            done = true;
        }

        else {
            animations.push(['s', lowIndex, highIndex]);
            animations.push(['sf', lowIndex, highIndex, array[lowIndex], array[highIndex]]);
            swap(array, lowIndex, highIndex);
            lowIndex++;
            highIndex--;
        }
    }

    animations.push(['pf']);
    
    return highIndex;
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}