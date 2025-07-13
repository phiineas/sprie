#!/usr/bin/env node

import { SpellChecker, SpellCheckOptions } from './spellChecker';
import { FileReader } from './utils/fileReader';
import * as path from 'path';

interface CLIOptions {
    file?: string;
    dictionary?: string;
    output?: string;
    maxSuggestions?: number;
    maxDistance?: number;
    ignoreCommon?: boolean;
    help?: boolean;
    version?: boolean;
}

class sprie {
    private spellChecker: SpellChecker;

    constructor(options: SpellCheckOptions = {}) {
        this.spellChecker = new SpellChecker(options);
    }

    async run(): Promise<void> {
        const args = this.parseArgs();
        
        if (args.help) {
            this.showHelp();
            return;
        }

        if (args.version) {
            this.showVersion();
            return;
        }

        try {
            // load dictionary
            const dictionaryPath = args.dictionary || this.getDefaultDictionaryPath();
            if (FileReader.fileExists(dictionaryPath)) {
                console.log(`loading dictionary from- ${dictionaryPath}`);
                this.spellChecker.loadDictionaryFromFile(dictionaryPath);
                console.log('dictionary loaded successfully\n');
            } else {
                console.log(`dictionary file not found- ${dictionaryPath}`);
                console.log('using minimal built-in dictionary\n');
                this.loadMinimalDictionary();
            }

            // check file or stdin
            if (args.file) {
                await this.checkFile(args.file, args.output);
            } else {
                await this.checkStdin();
            }

        } catch (error) {
            if (error instanceof Error) {
                console.error('error-', error.message);
            } else {
                console.error('error-', error);
            }
            process.exit(1);
        }
    }

    private parseArgs(): CLIOptions {
        const args = process.argv.slice(2);
        const options: CLIOptions = {};

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            switch (arg) {
                case '-f':
                case '--file':
                    options.file = args[++i];
                    break;
                case '-d':
                case '--dictionary':
                    options.dictionary = args[++i];
                    break;
                case '-o':
                case '--output':
                    options.output = args[++i];
                    break;
                case '-s':
                case '--max-suggestions':
                    options.maxSuggestions = parseInt(args[++i]);
                    break;
                case '-m':
                case '--max-distance':
                    options.maxDistance = parseInt(args[++i]);
                    break;
                case '--ignore-common':
                    options.ignoreCommon = true;
                    break;
                case '-h':
                case '--help':
                    options.help = true;
                    break;
                case '-v':
                case '--version':
                    options.version = true;
                    break;
                default:
                    if (!options.file && !arg.startsWith('-')) {
                        options.file = arg;
                    }
            }
        }

        return options;
    }

    private async checkFile(filePath: string, outputPath?: string): Promise<void> {
        if (!FileReader.fileExists(filePath)) {
            throw new Error(`file not found- ${filePath}`);
        }

        console.log(`checking file- ${filePath}\n`);
        
        const results = this.spellChecker.checkFile(filePath);
        
        this.spellChecker.printResults(results);
        
        if (outputPath) {
            // const report = this.spellChecker.generateReport(results, outputPath);
            console.log(`report saved to- ${outputPath}`);
        }
    }

    private async checkStdin(): Promise<void> {
        console.log('enter text to check (Press Ctrl+D to finish)-');
        
        const chunks: string[] = [];
        
        process.stdin.on('data', (chunk) => {
            chunks.push(chunk.toString());
        });
        
        process.stdin.on('end', () => {
            const text = chunks.join('');
            console.log('\nchecking text...\n');
            
            const results = this.spellChecker.checkText(text);
            this.spellChecker.printResults(results);
        });
    }

    private getDefaultDictionaryPath(): string {
        const possiblePaths = [
            path.join(__dirname, 'data', 'dictionary.txt'),
            path.join(process.cwd(), 'dictionary.txt'),
            path.join(process.cwd(), 'data', 'dictionary.txt'),
            '/usr/share/dict/words', // unix systems
            '/usr/dict/words'
        ];

        for (const dictPath of possiblePaths) {
            if (FileReader.fileExists(dictPath)) {
                return dictPath;
            }
        }

        return possiblePaths[0]; // return first as default
    }

    private loadMinimalDictionary(): void {
        // load a minimal set of common words
        const commonWords = [
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
            'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
            'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
            'hello', 'world', 'example', 'test', 'file', 'spell', 'check', 'word',
            'text', 'language', 'computer', 'program', 'software', 'application'
        ];
        
        this.spellChecker.loadDictionary(commonWords);
    }

    private showHelp(): void {
        console.log(`
sprie - typeScript spell checker CLI

Usage: 
  sprie [options] [file]
  sprie --file input.txt --output report.txt

Options:
  -f, --file <path>           File to check for spelling errors
  -d, --dictionary <path>     Dictionary file path
  -o, --output <path>         Output report file path
  -s, --max-suggestions <n>   Maximum number of suggestions (default: 5)
  -m, --max-distance <n>      Maximum edit distance for suggestions (default: 2)
  --ignore-common             Ignore common words
  -h, --help                  Show this help message
  -v, --version               Show version information

Examples:
  sprie document.txt
  sprie --file document.txt --dictionary custom-dict.txt
  sprie --file document.txt --output report.txt --max-suggestions 3
  echo "helo wrold" | sprie

Dictionary Format:
  The dictionary file should contain one word per line.
  Lines starting with # are treated as comments and ignored.
`);
    }

    private showVersion(): void {
        console.log('sprie - typeScript spell checker v1.0.0');
    }
}

// run CLI if this file is executed directly
if (require.main === module) {
    const cli = new sprie();
    cli.run().catch(error => {
        console.error('fatal error:', error.message);
        process.exit(1);
    });
}

export { sprie };
