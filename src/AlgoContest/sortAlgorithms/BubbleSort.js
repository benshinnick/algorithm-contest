export function getBubbleSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    bubbleSort(array, animations);
    return animations;
}
  
function bubbleSort(array, animations){
 
    // Animation codes:
    //  'c' denotes comparison between two indexes,
    //  'cf' denotes that a comparison is finished
    //  's' denotes a swap between two indexes,
    //  'sf' denotes a swap is finished
    let isSwapped = false;
    for(let i = 0; i < array.length; ++i){
        
        isSwapped = false;
        for(let j = 0; j < (array.length - i -1); ++j){
            if(array[j] > array[j+1]){
                animations.push(['c',j, j+1]);
                animations.push(['cf',j, j+1]);
                animations.push(['s', j, j+1, array[j], array[j+1]]);
                animations.push(['sf', j, j+1]);
                swap(array, j, j+1);
                isSwapped = true;
            }
            if(j+1 < array.length) {
                animations.push(['c',j, j+1]);
                animations.push(['cf',j, j+1]);
            }

        }
        
        if(!isSwapped){
            break;
        }
    } 
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}