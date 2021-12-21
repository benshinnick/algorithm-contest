export function getInsertionSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    insertionSort(array, animations);
    return animations;
}

function insertionSort(array, animations) {

    // Animation codes:
    //  'c' denotes comparison between two indexes,
    //  'cf' denotes that a comparison is finished
    //  's' denotes a swap between two indexes,
    //  'sf' denotes a swap is finished
    for(let i = 1; i < array.length; ++i) {
        animations.push(['c',i, i-1]);
        animations.push(['cf',i, i-1]);

        if(array[i] < array[i-1]) {
            let j = i;
            for(j; array[j] < array[j-1]; --j) {
                animations.push(['c', j, j-1]);
                animations.push(['cf', j, j-1]);
                animations.push(['s', j, j-1, array[j], array[j-1]]);
                animations.push(['sf']);
                swap(array, j, j-1);
            }
            if(j-1 >= 0) {
                animations.push(['c',j, j-1]);
                animations.push(['cf',j, j-1]);
            }
        }
    }
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}