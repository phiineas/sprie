"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = runTests;
const spellChecker_1 = require("../src/spellChecker");
const trie_1 = require("../src/datastructure/trie");
const wordProcesser_1 = require("../src/utils/wordProcesser");
const levenshteinDistance_1 = __importDefault(require("../src/algorithm/levenshteinDistance"));
// Simple test runner
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
    }
    assert(condition, testName) {
        if (condition) {
            console.log(`✅ ${testName}`);
            this.passed++;
        }
        else {
            console.log(`❌ ${testName}`);
            this.failed++;
        }
    }
    assertEqual(actual, expected, testName) {
        this.assert(JSON.stringify(actual) === JSON.stringify(expected), `${testName} - Expected: ${expected}, Actual: ${actual}`);
    }
    assertTrue(condition, testName) {
        this.assert(condition === true, testName);
    }
    assertFalse(condition, testName) {
        this.assert(condition === false, testName);
    }
    summary() {
        console.log(`\n📊 Test Summary:`);
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    }
}
function runTests() {
    const test = new TestRunner();
    console.log('🧪 Running Sprie Tests...\n');
    // Test Levenshtein Distance
    console.log('📐 Testing Levenshtein Distance:');
    test.assertEqual((0, levenshteinDistance_1.default)('cat', 'cat'), 0, 'Identical words');
    test.assertEqual((0, levenshteinDistance_1.default)('cat', 'bat'), 1, 'Single substitution');
    test.assertEqual((0, levenshteinDistance_1.default)('cat', 'cats'), 1, 'Single insertion');
    test.assertEqual((0, levenshteinDistance_1.default)('cats', 'cat'), 1, 'Single deletion');
    test.assertEqual((0, levenshteinDistance_1.default)('kitten', 'sitting'), 3, 'Multiple operations');
    // Test Trie
    console.log('\n🌳 Testing Trie:');
    const trie = new trie_1.Trie();
    trie.insert('cat');
    trie.insert('car');
    trie.insert('card');
    trie.insert('care');
    trie.insert('careful');
    test.assertTrue(trie.contains('cat'), 'Trie contains inserted word');
    test.assertFalse(trie.contains('dog'), 'Trie does not contain non-inserted word');
    const prefixResults = trie.getWordsWithPrefix('car');
    test.assertTrue(prefixResults.includes('car'), 'Prefix search includes exact match');
    test.assertTrue(prefixResults.includes('card'), 'Prefix search includes extensions');
    test.assertTrue(prefixResults.includes('care'), 'Prefix search includes other extensions');
    test.assertFalse(prefixResults.includes('cat'), 'Prefix search excludes non-matches');
    const distanceResults = trie.getWordsWithinDistance('cat', 1);
    test.assertTrue(distanceResults.includes('cat'), 'Distance search includes exact match');
    test.assertTrue(distanceResults.includes('car'), 'Distance search includes close matches');
    // Test Word Processor
    console.log('\n📝 Testing Word Processor:');
    const words = wordProcesser_1.WordProcessor.extractWords('Hello, world! This is a test.');
    test.assertTrue(words.includes('hello'), 'Extracts and normalizes words');
    test.assertTrue(words.includes('world'), 'Removes punctuation');
    test.assertTrue(words.includes('test'), 'Handles multiple words');
    test.assertFalse(words.includes('!'), 'Filters out punctuation');
    test.assertTrue(wordProcesser_1.WordProcessor.isValidWord('hello'), 'Recognizes valid words');
    test.assertFalse(wordProcesser_1.WordProcessor.isValidWord('123'), 'Rejects numbers');
    test.assertFalse(wordProcesser_1.WordProcessor.isValidWord('a'), 'Rejects single characters');
    // Test Spell Checker
    console.log('\n🔍 Testing Spell Checker:');
    const checker = new spellChecker_1.SpellChecker({
        maxSuggestions: 3,
        maxDistance: 2
    });
    // Load test dictionary
    checker.loadDictionary(['hello', 'world', 'test', 'spell', 'check', 'word', 'help']);
    const correctResult = checker.checkWord('hello');
    test.assertTrue(correctResult.isCorrect, 'Correctly identifies correct words');
    test.assertEqual(correctResult.suggestions.length, 0, 'No suggestions for correct words');
    const incorrectResult = checker.checkWord('helo');
    test.assertFalse(incorrectResult.isCorrect, 'Correctly identifies misspelled words');
    test.assertTrue(incorrectResult.suggestions.length > 0, 'Provides suggestions for misspelled words');
    test.assertTrue(incorrectResult.suggestions.includes('hello'), 'Suggests correct spelling');
    // Test text checking
    const textResults = checker.checkText('helo wrold this is a tset');
    test.assertTrue(textResults.length > 0, 'Finds errors in text');
    test.assertTrue(textResults.some(r => r.word === 'helo'), 'Identifies specific misspelled words');
    test.summary();
}
// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}
//# sourceMappingURL=test.js.map