import { useEffect, useState } from 'react';

function DijkstraComponent({ source, destination }) {
    const [path, setPath] = useState([]);

    useEffect(() => {
        const nodes = {};
        const edges = {};

        // Gather all nodes
        document.querySelectorAll('div[id^="n"]').forEach(node => {
            const id = node.id;
            nodes[id] = [];
        });

        // Gather all edges with weights
        document.querySelectorAll('line[id^="e"]').forEach(line => {
            const id = line.id;
            const [src, dest] = id.replace('e', '').split('-');
            const weight = parseFloat(line.getAttribute('data-weight')) || 1; // Default weight is 1 if not provided
            
            edges[id] = { src, dest, weight };

            if (nodes[`n${src}`]) {
                nodes[`n${src}`].push({ node: `n${dest}`, weight });
            }
            if (nodes[`n${dest}`]) {
                nodes[`n${dest}`].push({ node: `n${src}`, weight });
            }
        });

        function dijkstra(source, target) {
            const distances = {};
            const previousNodes = {};
            const pq = new Map(); // Min Priority Queue (alternative to heap)

            // Initialize distances
            for (let node in nodes) {
                distances[node] = Infinity;
                previousNodes[node] = null;
            }
            distances[source] = 0;
            pq.set(source, 0);

            while (pq.size > 0) {
                // Get the node with the smallest distance
                let minNode = [...pq.entries()].reduce((a, b) => (a[1] < b[1] ? a : b))[0];
                pq.delete(minNode);

                // Process neighbors
                for (let { node: neighbor, weight } of nodes[minNode]) {
                    const newDist = distances[minNode] + weight;
                    if (newDist < distances[neighbor]) {
                        distances[neighbor] = newDist;
                        previousNodes[neighbor] = minNode;
                        pq.set(neighbor, newDist);
                    }
                }
            }

            // Backtrack from the target to the source to find the path
            const path = [];
            let currentNode = target;
            while (currentNode !== null) {
                path.unshift(currentNode);
                currentNode = previousNodes[currentNode];
            }

            return { distances, path };
        }

        const runDijkstra = () => {
            if (source && destination) {
                const { path } = dijkstra(source, destination);
                setPath(path);

                // Reset opacity of all nodes and edges to 0
                document.querySelectorAll('div[id^="n"], line[id^="e"]').forEach(element => {
                    element.style.opacity = '0';
                });

                // Show source and destination nodes
                document.getElementById(source)?.style.setProperty('opacity', '1');
                document.getElementById(destination)?.style.setProperty('opacity', '1');

                // Show path nodes and edges
                path.forEach((node, index) => {
                    if (index < path.length - 1) {
                        const nextNode = path[index + 1];
                        const edgeId = `e${node.replace('n', '')}-${nextNode.replace('n', '')}`;
                        const reverseEdgeId = `e${nextNode.replace('n', '')}-${node.replace('n', '')}`;
                        
                        if (document.getElementById(edgeId)) {
                            document.getElementById(edgeId).style.opacity = '1';
                        }
                        if (document.getElementById(reverseEdgeId)) {
                            document.getElementById(reverseEdgeId).style.opacity = '1';
                        }
                    }
                });
            }
        };

        runDijkstra();
    }, [source, destination]);

    return null;
}

export default DijkstraComponent;
