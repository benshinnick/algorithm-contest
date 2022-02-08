# Algorithm Contest

React application for visualizing sorting and pathfinding algorithms competing agianst each other in real time.

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
