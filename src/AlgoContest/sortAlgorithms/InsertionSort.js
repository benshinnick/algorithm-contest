export function getInsertionSortAnimations(array) {
    const animations = [];
    animationLoggingInsertionSort(array, animations);
    return animations;
}

function animationLoggingInsertionSort(array, animations) {

    //animation codes:
    // 'c' denotes comparison between two indexes,
    // 's' denotes a swap between two indexes,
    // 'cf' denotes that a comparison (or comparison and swap) is finished
    for(let i = 1; i < array.length; ++i) {
        if(array[i] < array[i-1]) {
            let j = i;
            for(j; array[j] < array[j-1]; --j) {
                animations.push(['c', j, j-1]);
                animations.push(['s', j, j-1, array[j], array[j-1]]);
                swap(array, j, j-1);
                animations.push(['cf', j, j-1]);
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

//For Testing Only
export function standardInsertionSort(array) {

    for(let i = 1; i < array.length; ++i) {
        for(let j = i; array[j] < array[j-1]; --j) {
            swap(array, j, j-1);
        }
    }

    return array;
}