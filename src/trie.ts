class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string): void {
        let node = this.root;
        for (const char of word) {
            if(!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }

            node = node.children.get(char)!;
        }

        node.isEndOfWord = true;
    }

    contains(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char)!;
        }

        return node.isEndOfWord;
    }

    // getWordsWithPrefix 
}