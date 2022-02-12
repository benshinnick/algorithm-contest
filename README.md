# Algorithm Contest

React application for visualizing sorting and pathfinding algorithms competing agianst each other in real time.

## Motivation
I built this project because all algorithm visualization tools I could find online made it difficult to compare different algorithms, especially for algorithms with similar time complexites. My goal with this project is to give the user a good sense of why and when sorting and pathfinding algorithms perform better (or worse) than other related algorithms.

## Accessing The Project

https://benshinnick.github.io/algorithm-contest/

Google Chrome is the recommended browser to run this project in. However, other browsers should have little to no issues.

## Implemented Sorting Algorithms
| Algorithm | Best | Average | Worst | Space |
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
| Dijkstra's Algorithm | weighted | gaurentees the shortest path |
| A* Search | weighted | guarentees the shortest path |
| Greedy Best-first Search | weighted | does not guarentee the shortest path |
| Depth-first Search | unweighted | does not gaurentee the shortest path |
| Breadth-first-search | unweighted | gaurantees the shortest path for unweighted graphs |

## Quick Note On Algorithm Implementations

Not all algorithm implementations are fully optimized. For example, insertion sort swaps elements to insert a value into its correct index instead of shifting and then inserting the value. I tried to maximize efficiency wherever posssible, but I also tried to implement the most visually responsive approach for each algorithm.

## Functionality Reference

TODO
