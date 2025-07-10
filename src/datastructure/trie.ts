class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string): void {
        let node = this.root;
        for (const char of word.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
        }
        node.isEndOfWord = true;
    }

    contains(word: string): boolean {
        let node = this.root;
        for (const char of word.toLowerCase()) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char)!;
        }
        return node.isEndOfWord;
    }

    getWordsWithPrefix(prefix: string): string[] {
        const results: string[] = [];
        let node = this.root;
        
        // navigate to the prefix node
        for (const char of prefix.toLowerCase()) {
            if (!node.children.has(char)) {
                return results; // Prefix not found
            }
            node = node.children.get(char)!;
        }
        
        // collect all words with this prefix
        this._collectWords(node, prefix.toLowerCase(), results);
        return results;
    }

    private _collectWords(node: TrieNode, currentWord: string, results: string[]): void {
        if (node.isEndOfWord) {
            results.push(currentWord);
        }
        
        for (const [char, childNode] of node.children) {
            this._collectWords(childNode, currentWord + char, results);
        }
    }

    getAllWords(): string[] {
        const results: string[] = [];
        this._collectWords(this.root, '', results);
        return results;
    }

    // get words within a certain edit distance using DFS
    getWordsWithinDistance(word: string, maxDistance: number): string[] {
        const results: string[] = [];
        const wordLower = word.toLowerCase();
        
        // DFS through trie with dynamic programming approach
        const dp = Array(wordLower.length + 1).fill(0).map((_, i) => i);
        
        for (const [char, childNode] of this.root.children) {
            this._searchWithinDistance(
                childNode, 
                char, 
                wordLower, 
                maxDistance, 
                dp, 
                results
            );
        }
        
        return results;
    }

    private _searchWithinDistance(
        node: TrieNode, 
        currentWord: string, 
        targetWord: string, 
        maxDistance: number, 
        prevRow: number[], 
        results: string[]
    ): void {
        const currentRow = [prevRow[0] + 1];
        
        // calculate current row of edit distance matrix
        for (let i = 1; i <= targetWord.length; i++) {
            const insertCost = currentRow[i - 1] + 1;
            const deleteCost = prevRow[i] + 1;
            const substituteCost = prevRow[i - 1] + 
                (targetWord[i - 1] === currentWord[currentWord.length - 1] ? 0 : 1);
            
            currentRow.push(Math.min(insertCost, deleteCost, substituteCost));
        }
        
        // if this is a valid word and within distance, add it
        if (node.isEndOfWord && currentRow[targetWord.length] <= maxDistance) {
            results.push(currentWord);
        }
        
        // continue searching if minimum distance in row is within threshold
        if (Math.min(...currentRow) <= maxDistance) {
            for (const [char, childNode] of node.children) {
                this._searchWithinDistance(
                    childNode, 
                    currentWord + char, 
                    targetWord, 
                    maxDistance, 
                    currentRow, 
                    results
                );
            }
        }
    }
}
