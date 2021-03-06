# Algorithm Contest
React application for visualizing sorting and pathfinding algorithms competing agianst each other in real time.

## Motivation
I built this project because all algorithm visualization tools I could find online made it difficult to compare different algorithms, especially for algorithms with similar time complexites. My goal with this project was to give people a good sense of which popular sorting and pathfinding algorithms perform better than other related algorithms.

## Accessing The Project
https://benshinnick.github.io/algorithm-contest/
> Note: I recommended using Google Chrome. However, other browsers should have little to no issues.

## Implemented Sorting Algorithms
<!-- | Algorithm | Best | Average | Worst | Space | -->
| &emsp;&nbsp;Algorithm&nbsp;&emsp; | &emsp;&emsp;&nbsp;Best&nbsp;&emsp;&emsp; | &emsp;&nbsp;Average&nbsp;&emsp; | &emsp;&emsp;Worst&emsp;&emsp; | &ensp;&nbsp;&nbsp;Space&nbsp;&nbsp;&ensp; |
| :---: | :---: | :---: | :---:| :---: |
| Merge | Ω(nlog(n)) | θ(nlog(n)) |	O(nlog(n)) | O(n) |
| Quick | Ω(nlog(n))	| θ(nlog(n)) |	O(n^2) | O(log(n)) |
| Heap | Ω(nlog(n)) | θ(nlog(n)) | O(nlog(n)) | O(1) |
| Shell | Ω(nlog(n)) | θ(nlog^2(n)) | O(nlog^2(n)) | O(1) |
| Insertion | Ω(n) |θ(n^2) |O(n^2) | O(1) |
| Bubble | Ω(n) |	θ(n^2) | O(n^2) | O(1) |
| Selection | Ω(n^2) | θ(n^2) | O(n^2) | O(1) |

## Implemented Pathfinding Algorithms
| Algorithm | Is Weighted | Shortest Path |
| :---: | :---: | :--- |
| Dijkstra's Algorithm | weighted | gaurentees the shortest path &emsp; |
| A* Search | weighted | gaurentees the shortest path &emsp; |
| Greedy Best-first Search | weighted | does not gaurentee the shortest path &emsp; |
| Depth-first Search | unweighted | does not gaurentee the shortest path &emsp; |
| Breadth-first-search | unweighted | gaurentees the shortest path &emsp; |

## Performance Improvements
The project has performed very well in my testing. However, if you ever notice a drop in performance there are a couple things you can do to limit the number of scheduled animations:
- Decreasing your browser window width so that the algorithms are working with a smaller array/graph
- Decreasing the number of contestants<br></br>
<!-- - Removing the most inefficient sorting algorithms like bubble sort from the sorting contest -->

<!-- ## Quick Note On Algorithm Implementations -->

<!-- Not all algorithm implementations are fully optimized. For example, insertion sort swaps elements to insert a value into its correct index instead of shifting and then inserting the value. I tried to maximize efficiency wherever posssible, but I also tried to implement the most visually responsive approach for each algorithm. -->


> _a project by **Ben Shinnick**_
