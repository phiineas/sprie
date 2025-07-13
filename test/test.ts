import { SpellChecker } from '../src/spellChecker';
import { Trie } from '../src/datastructure/trie';
import { WordProcessor } from '../src/utils/wordProcesser';
import levenshteinDistance from '../src/algorithm/levenshteinDistance';

class TestRunner {
    private passed = 0;
    private failed = 0;

    assert(condition: boolean, testName: string): void {
        if (condition) {
            console.log(`PASS ${testName}`);
            this.passed++;
        } else {
            console.log(`FAIL ${testName}`);
            this.failed++;
        }
    }

    assertEqual<T>(actual: T, expected: T, testName: string): void {
        this.assert(JSON.stringify(actual) === JSON.stringify(expected), 
                   `${testName} - expected: ${expected}, actual: ${actual}`);
    }

    assertTrue(condition: boolean, testName: string): void {
        this.assert(condition === true, testName);
    }

    assertFalse(condition: boolean, testName: string): void {
        this.assert(condition === false, testName);
    }

    summary(): void {
        console.log(`\ntest Summary:`);
        console.log(`passed- ${this.passed}`);
        console.log(`failed- ${this.failed}`);
        console.log(`success rate- ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    }
}

function runTests(): void {
    const test = new TestRunner();
    
    console.log('running sprie tests...\n');

    // test levenshtein distance
    console.log('testing levenshtein distance-');
    test.assertEqual(levenshteinDistance('cat', 'cat'), 0, 'identical words');
    test.assertEqual(levenshteinDistance('cat', 'bat'), 1, 'single substitution');
    test.assertEqual(levenshteinDistance('cat', 'cats'), 1, 'single insertion');
    test.assertEqual(levenshteinDistance('cats', 'cat'), 1, 'single deletion');
    test.assertEqual(levenshteinDistance('kitten', 'sitting'), 3, 'multiple operations');

    // test trie
    console.log('\ntesting trie-');
    const trie = new Trie();
    trie.insert('cat');
    trie.insert('car');
    trie.insert('card');
    trie.insert('care');
    trie.insert('careful');
    
    test.assertTrue(trie.contains('cat'), 'trie contains inserted word');
    test.assertFalse(trie.contains('dog'), 'trie does not contain non-inserted word');
    
    const prefixResults = trie.getWordsWithPrefix('car');
    test.assertTrue(prefixResults.includes('car'), 'prefix search includes exact match');
    test.assertTrue(prefixResults.includes('card'), 'prefix search includes extensions');
    test.assertTrue(prefixResults.includes('care'), 'prefix search includes other extensions');
    test.assertFalse(prefixResults.includes('cat'), 'prefix search excludes non-matches');

    const distanceResults = trie.getWordsWithinDistance('cat', 1);
    test.assertTrue(distanceResults.includes('cat'), 'distance search includes exact match');
    test.assertTrue(distanceResults.includes('car'), 'distance search includes close matches');

    // test word processor
    console.log('\ntesting word processor-');
    const words = WordProcessor.extractWords('Hello, world! This is a test.');
    test.assertTrue(words.includes('hello'), 'extracts and normalizes words');
    test.assertTrue(words.includes('world'), 'removes punctuation');
    test.assertTrue(words.includes('test'), 'handles multiple words');
    test.assertFalse(words.includes('!'), 'filters out punctuation');

    test.assertTrue(WordProcessor.isValidWord('hello'), 'recognizes valid words');
    test.assertFalse(WordProcessor.isValidWord('123'), 'rejects numbers');
    test.assertFalse(WordProcessor.isValidWord('a'), 'rejects single characters');

    // test spell checker
    console.log('\ntesting spell checker-');
    const checker = new SpellChecker({
        maxSuggestions: 3,
        maxDistance: 2
    });
    
    // load test dictionary
    checker.loadDictionary(['hello', 'world', 'test', 'spell', 'check', 'word', 'help']);
    
    const correctResult = checker.checkWord('hello');
    test.assertTrue(correctResult.isCorrect, 'correctly identifies correct words');
    test.assertEqual(correctResult.suggestions.length, 0, 'no suggestions for correct words');
    
    const incorrectResult = checker.checkWord('helo');
    test.assertFalse(incorrectResult.isCorrect, 'correctly identifies misspelled words');
    test.assertTrue(incorrectResult.suggestions.length > 0, 'provides suggestions for misspelled words');
    test.assertTrue(incorrectResult.suggestions.includes('hello'), 'suggests correct spelling');

    // test text checking
    const textResults = checker.checkText('helo wrold this is a tset');
    test.assertTrue(textResults.length > 0, 'finds errors in text');
    test.assertTrue(textResults.some(r => r.word === 'helo'), 'identifies specific misspelled words');

    test.summary();
}

// run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

export { runTests };
