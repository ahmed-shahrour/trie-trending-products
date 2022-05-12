function Node(value) {
    this.value = value
    this.isEndOfWord = false
    this.children = {}
}

class Trie {
    constructor(words = []) {
        this.root = new Node(null)
        this.build(words)
    }

    build(words) {
        words.forEach(word => this.insert(word))
    }

    insert(word) {
        let current = this.root

        for (let char of word) {
            if (!current.children[char]) current.children[char] = new Node(char);
            current = current.children[char]
        }

        current.isEndOfWord = true
    }

    suggestionsRecommendation(node, word, resultArr, max) {
        if (node.isEndOfWord) resultArr.push(word);
        if (resultArr.length >= max) return;
        for (const [key, value] of Object.entries(node.children)) {
            this.suggestionsRecommendation(value, word + key, resultArr)
        }
    }

    autoSuggestions(prefix, max) {
        if (!prefix || prefix.length < 2) return [];
        let node = this.root

        for (let char of prefix) {
            if (!node.children[char]) return [];
            node = node.children[char]
        }

        if (!Object.keys(node.children).length) return [];

        let results = []
        this.suggestionsRecommendation(node, prefix, results, max)
        return results
    }
}

module.exports = Trie