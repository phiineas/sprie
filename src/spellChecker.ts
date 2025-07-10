import { Trie } from "./datastructure/trie";
import { WordProcessor } from "./utils/wordProcesser";
import { FileReader } from "./utils/fileReader";
import levenshteinDistance from "./algorithm/levenshteinDistance";

export interface SpellCheckResult {
    word: string;
    isCorrect: boolean;
    suggestions: string[];
    line?: number;
    column?: number;
}

export interface SpellCheckOptions {
    maxSuggestions?: number;
    maxDistance?: number;
    includePrefixSuggestions?: boolean;
    ignoreCommonWords?: boolean;
    customIgnoreWords?: string[];
}

export class SpellChecker {
    private dictionary: Trie;
    private ignoreWords: Set<string>;
    private options: Required<SpellCheckOptions>;

    constructor(options: SpellCheckOptions = {}) {
        this.dictionary = new Trie();
        this.ignoreWords = new Set();
        this.options = {
            maxSuggestions: options.maxSuggestions || 5,
            maxDistance: options.maxDistance || 2,
            includePrefixSuggestions: options.includePrefixSuggestions !== false,
            ignoreCommonWords: options.ignoreCommonWords !== false,
            customIgnoreWords: options.customIgnoreWords || []
        };

        this.initializeIgnoreWords();
    }

    private initializeIgnoreWords(): void {
        if (this.options.ignoreCommonWords) {
            const commonWords = WordProcessor.getCommonWords();
            commonWords.forEach(word => this.ignoreWords.add(word));
        }

        this.options.customIgnoreWords.forEach(word => {
            this.ignoreWords.add(WordProcessor.normalizeWord(word));
        });
    }

    loadDictionary(words: string[]): void {
        words.forEach(word => {
            const cleanWord = WordProcessor.cleanWord(word);
            if (WordProcessor.isValidWord(cleanWord)) {
                this.dictionary.insert(cleanWord);
            }
        });
    }

    loadDictionaryFromFile(filePath: string): void {
        const words = FileReader.readLines(filePath);
        this.loadDictionary(words);
    }

    addWord(word: string): void {
        const cleanWord = WordProcessor.cleanWord(word);
        if (WordProcessor.isValidWord(cleanWord)) {
            this.dictionary.insert(cleanWord);
        }
    }

    removeIgnoreWord(word: string): void {
        this.ignoreWords.delete(WordProcessor.normalizeWord(word));
    }

    addIgnoreWord(word: string): void {
        this.ignoreWords.add(WordProcessor.normalizeWord(word));
    }

    checkWord(word: string): SpellCheckResult {
        const cleanWord = WordProcessor.cleanWord(word);
        const normalizedWord = WordProcessor.normalizeWord(cleanWord);
        
        if (this.ignoreWords.has(normalizedWord)) {
            return {
                word: word,
                isCorrect: true,
                suggestions: []
            };
        }

        const isCorrect = this.dictionary.contains(cleanWord);
        const suggestions = isCorrect ? [] : this.getSuggestions(cleanWord);

        return {
            word: word,
            isCorrect: isCorrect,
            suggestions: suggestions
        };
    }

    checkText(text: string): SpellCheckResult[] {
        const words = WordProcessor.extractWords(text);
        const results: SpellCheckResult[] = [];

        words.forEach(word => {
            const result = this.checkWord(word);
            if (!result.isCorrect) {
                results.push(result);
            }
        });

        return results;
    }

    checkFile(filePath: string): SpellCheckResult[] {
        const fileContent = FileReader.readFile(filePath);
        const results: SpellCheckResult[] = [];
        const lines = fileContent.split('\n');

        lines.forEach((line, lineIndex) => {
            const words = WordProcessor.extractWords(line);
            
            words.forEach(word => {
                const result = this.checkWord(word);
                if (!result.isCorrect) {
                    // find column position (approximate)
                    const column = line.toLowerCase().indexOf(word.toLowerCase()) + 1;
                    
                    results.push({
                        ...result,
                        line: lineIndex + 1,
                        column: column
                    });
                }
            });
        });

        return results;
    }

    getSuggestions(misspelledWord: string): string[] {
        const suggestions = new Set<string>();
        const cleanWord = WordProcessor.cleanWord(misspelledWord);

        // 1. get suggestions using edit distance
        const distanceSuggestions = this.dictionary.getWordsWithinDistance(
            cleanWord, 
            this.options.maxDistance
        );
        
        // sort by edit distance
        const sortedDistanceSuggestions = distanceSuggestions
            .map(word => ({
                word,
                distance: levenshteinDistance(cleanWord, word)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, this.options.maxSuggestions)
            .map(item => item.word);

        sortedDistanceSuggestions.forEach(word => suggestions.add(word));

        // 2. get prefix-based suggestions if enabled
        if (this.options.includePrefixSuggestions && suggestions.size < this.options.maxSuggestions) {
            const prefixLength = Math.min(cleanWord.length, 3);
            const prefix = cleanWord.substring(0, prefixLength);
            const prefixSuggestions = this.dictionary.getWordsWithPrefix(prefix)
                .filter(word => !suggestions.has(word))
                .slice(0, this.options.maxSuggestions - suggestions.size);
            
            prefixSuggestions.forEach(word => suggestions.add(word));
        }

        // 3. get phonetic suggestions (basic implementation)
        if (suggestions.size < this.options.maxSuggestions) {
            const phoneticSuggestions = this.getPhoneticSuggestions(cleanWord)
                .filter(word => !suggestions.has(word))
                .slice(0, this.options.maxSuggestions - suggestions.size);
            
            phoneticSuggestions.forEach(word => suggestions.add(word));
        }

        return Array.from(suggestions).slice(0, this.options.maxSuggestions);
    }

    private getPhoneticSuggestions(word: string): string[] {
        // basic phonetic transformations
        const transformations = [
            // common letter substitutions
            { from: 'ph', to: 'f' },
            { from: 'f', to: 'ph' },
            { from: 'c', to: 'k' },
            { from: 'k', to: 'c' },
            { from: 'z', to: 's' },
            { from: 's', to: 'z' },
            { from: 'i', to: 'y' },
            { from: 'y', to: 'i' }
        ];

        const suggestions: string[] = [];
        
        transformations.forEach(({ from, to }) => {
            if (word.includes(from)) {
                const transformed = word.replace(new RegExp(from, 'g'), to);
                if (this.dictionary.contains(transformed)) {
                    suggestions.push(transformed);
                }
            }
        });

        return suggestions;
    }

    printResults(results: SpellCheckResult[]): void {
        if (results.length === 0) {
            console.log('no spelling errors found!');
            return;
        }

        console.log(`found ${results.length} spelling errors-\n`);
        
        results.forEach((result, index) => {
            const location = result.line ? ` (line ${result.line}${result.column ? `, column ${result.column}` : ''})` : '';
            console.log(`${index + 1}. "${result.word}"${location}`);
            
            if (result.suggestions.length > 0) {
                console.log(`suggestions- ${result.suggestions.join(', ')}`);
            } else {
                console.log('no suggestions available');
            }
            console.log();
        });
    }

    generateReport(results: SpellCheckResult[], outputPath?: string): string {
        const report = `spell ceck report
        generated- ${new Date().toISOString()}
        total errors- ${results.length}

        ${results.length === 0 ? 'no spelling errors found!' : 
                    results.map((result, index) => {
                        const location = result.line ? ` (line ${result.line}${result.column ? `, column ${result.column}` : ''})` : '';
                        return `${index + 1}. "${result.word}"${location}
        suggestions: ${result.suggestions.length > 0 ? result.suggestions.join(', ') : 'none'}`;
                    }).join('\n\n')
                }`;

        if (outputPath) {
            FileReader.writeFile(outputPath, report);
        }

        return report;
    }
}
