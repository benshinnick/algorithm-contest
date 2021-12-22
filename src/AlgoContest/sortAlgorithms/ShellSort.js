export function getShellSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    shellSort(array, animations);
    return animations;
}

function shellSort(array, animations) {

    // Animation codes:
    //  'c' denotes comparison between two indexes,
    //  'cf' denotes that a comparison is finished
    //  's' denotes a swap between two indexes,
    //  'sf' denotes a swap is finished

	for (let gap = Math.floor(array.length/2); gap > 0; gap = Math.floor(gap/2))
	{
		//insetion sort on each section
		for (let i = gap; i < array.length; ++i)
		{
            let first = array[i];
            let j = i;
            for (j = i; j >= gap && array[j - gap] > first; j -= gap) {
                animations.push(['c', j, j-gap]);
                animations.push(['cf', j, j-gap]);
                animations.push(['s', j, j-gap]);
                animations.push(['sf', j, j-gap, array[j], array[j-gap]]);
                swap(array, j, j-gap);
            }
            if(j-gap >= 0) {
                animations.push(['c',j, j-gap]);
                animations.push(['cf',j, j-gap]);
            }
		}
	}

    console.log(array);
}

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}