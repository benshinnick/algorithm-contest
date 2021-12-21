export function getMergeSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    const auxiliaryArray = array.slice();
    mergeSort(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations;
}
  
function mergeSort(mainArray, startIndex, endIndex, auxiliaryArray, animations) {
    if (startIndex >= endIndex) return;
    const middleIndex = Math.floor((startIndex + endIndex) / 2);
    mergeSort(auxiliaryArray, startIndex, middleIndex, mainArray, animations);
    mergeSort(auxiliaryArray, middleIndex + 1, endIndex, mainArray, animations);
    merge(mainArray, startIndex, middleIndex, endIndex, auxiliaryArray, animations);
}
  
function merge(mainArray, startIndex, middleIndex, endIndex, auxiliaryArray, animations) {

    // Animation codes:
    //  'c' denotes comparison between two indexes,
    //  'cf' denotes that a comparison is finished
    //  'o' denotes a value in the main array is overwritten by a value in the auxiliary array
    //  'of' denates that a value has finished being overwritten
    let k = startIndex;
    let i = startIndex;
    let j = middleIndex + 1;
    while(i <= middleIndex && j <= endIndex) {
        animations.push(['c', i, j]);
        animations.push(['cf', i, j]);
        if(auxiliaryArray[i] <= auxiliaryArray[j]) {
            animations.push(['o', k]);
            animations.push(['of', k, auxiliaryArray[i]]);
            mainArray[k++] = auxiliaryArray[i++];
        } else {
            animations.push(['o', k]);
            animations.push(['of', k, auxiliaryArray[j]]);
            mainArray[k++] = auxiliaryArray[j++];
        }
    }
    while(i <= middleIndex) {
        animations.push(['c', i, i]);
        animations.push(['cf', i, i]);
        animations.push(['o', k]);
        animations.push(['of', k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIndex) {
        animations.push(['c', j, j]);
        animations.push(['cf', j, j]);
        animations.push(['o', k]);
        animations.push(['of', k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
        }
  }