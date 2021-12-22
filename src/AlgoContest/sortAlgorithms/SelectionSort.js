export function getSelectionSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    selectionSort(array, animations);
    return animations;
}

function selectionSort(array, animations) {

    // Animation codes:
    //  'c' denotes comparison between two indexes,
    //  'cf' denotes that a comparison is finished
    //  's' denotes a swap between two indexes,
    //  'sf' denotes a swap is finished
    //  'm' denotes that we are finished with our minumun index
    for (let i = 0; i < array.length - 1; ++i) {

        let minIndex = i;
        for (let j = i + 1; j < array.length; ++j) {
            animations.push(['c', j, minIndex]);
            animations.push(['cf', j]);
            if (array[j] < array[minIndex]) {
                animations.push(['m', minIndex]);
                minIndex = j;
            }     
        }
        animations.push(['m', minIndex]);
        
        animations.push(['s', i, minIndex]);
        animations.push(['sf', i, minIndex, array[i], array[minIndex]]);
        swap(array, i , minIndex);
    }
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}