export class WordProcessor {
    private static readonly WORD_SEPARATORS = /[\s\-_.,!?;:()\[\]{}"/\\]+/;
    private static readonly PUNCTUATION = /[.,!?;:()[\]{}"/\\]/g;
    private static readonly NUMBERS = /\d+/g;

    static extractWords(text: string): string[] {
        return text
            .toLowerCase()
            .split(this.WORD_SEPARATORS)
            .map(word => this.cleanWord(word))
            .filter(word => this.isValidWord(word));
    }

    static cleanWord(word: string): string {
        return word
            .replace(this.PUNCTUATION, '')
            .replace(/^\W+|\W+$/g, '') // remove leading/trailing non-word chars
            .trim();
    }

    static isValidWord(word: string): boolean {
        if (!word || word.length < 2) return false;
        if (this.NUMBERS.test(word)) return false;
        if (!/[a-zA-Z]/.test(word)) return false; // must contain at least one letter
        return true;
    }

    static normalizeWord(word: string): string {
        return word.toLowerCase().trim();
    }

    static removeDuplicates(words: string[]): string[] {
        return [...new Set(words)];
    }

    static sortWords(words: string[]): string[] {
        return words.sort((a, b) => a.localeCompare(b));
    }

    static getWordFrequency(words: string[]): Map<string, number> {
        const frequency = new Map<string, number>();
        
        words.forEach(word => {
            const normalized = this.normalizeWord(word);
            frequency.set(normalized, (frequency.get(normalized) || 0) + 1);
        });
        
        return frequency;
    }

    static filterByLength(words: string[], minLength: number = 2, maxLength: number = 50): string[] {
        return words.filter(word => word.length >= minLength && word.length <= maxLength);
    }

    static capitalizeWord(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    static getCommonWords(): Set<string> {
        return new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
            'above', 'below', 'between', 'among', 'within', 'without', 'under', 'over',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
            'must', 'can', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
            'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
            'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'
        ]);
    }
}
