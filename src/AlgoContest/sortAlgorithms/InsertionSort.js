export function standardInsertionSort(array) {

    for(let i = 1; i < array.length; ++i) {
        for(let j = i; array[j] < array[j-1]; --j) {
            swap(array, j, j-1);
        }
    }
    return array;
}

export function getInsertionSortAnimations(array) {
    const animations = [];
    animationLoggingInsertionSort(array, animations);
    return animations;
}

function animationLoggingInsertionSort(array, animations) {

    for(let i = 1; i < array.length; ++i) {
        animations.push(['comparison',i, i-1]);

        if(array[i] < array[i-1]) {
            let j = i;
            for(j; array[j] < array[j-1]; --j) {
                animations.push(['comparison',i, i-1]);
                animations.push(['swap', i, j, array[i], array[j]]);
                swap(array, j, j-1);
            }
            if(j-1 >= 0) {
                animations.push(['comparison',j, j-1]);
            }
        }

    }
    return array;
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}