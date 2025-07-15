# Sprie - TypeScript Spell Checker CLI

A command-line spell checker built with TypeScript that uses a Trie (Prefix Tree) data structure for efficient dictionary storage and the Levenshtein distance algorithm for intelligent word suggestions.

## Features

- **Efficient Dictionary Storage**: Uses Trie data structure for fast word lookups
- **Smart Suggestions**: Levenshtein distance algorithm for accurate spell correction
- **File & Stdin Support**: Check files or input text directly
- **Customizable Options**: Configure suggestion count, edit distance, and more
- **Report Generation**: Generate detailed spell check reports
- **Comprehensive Dictionary**: Built-in dictionary with common English words and programming terms
- **Line and Column Reporting**: Shows exact location of spelling errors in files

## Installation

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd sprie

# Install dependencies
npm install

# Build the project
npm run build

# Run the spell checker
npm start
```

### Global Installation (after publishing)

```bash
npm install -g sprie
```

## Usage

### Command Line Interface

```bash
# Check a file for spelling errors (using npm start)
npm start data/sample.txt

# Or run directly with node
node dist/src/index.js document.txt

# Check a file with custom options
npm start -- --file document.txt --max-suggestions 3 --max-distance 2

# Use a custom dictionary
node dist/src/index.js --file document.txt --dictionary my-dictionary.txt

# Generate a report
npm start -- --file document.txt --output report.txt

# Check text from stdin
echo "helo wrold" | npm start

# Show help
npm start -- --help

# Show version
npm start -- --version
```

### Available Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--file` | `-f` | File to check for spelling errors | - |
| `--dictionary` | `-d` | Custom dictionary file path | `data/dictionary.txt` |
| `--output` | `-o` | Output report file path | - |
| `--max-suggestions` | `-s` | Maximum number of suggestions | 5 |
| `--max-distance` | `-m` | Maximum edit distance for suggestions | 2 |
| `--ignore-common` | - | Ignore common English words | false |
| `--help` | `-h` | Show help message | - |
| `--version` | `-v` | Show version information | - |

### Examples

```bash
# Basic file checking
npm start data/sample.txt

# Check with custom dictionary and save report
npm start -- --file essay.txt --dictionary technical-terms.txt --output spell-report.txt

# Get more suggestions with higher edit distance
npm start -- --file article.txt --max-suggestions 10 --max-distance 3

# Check text from command line
echo "helo wrold this is a tset" | npm start

# Interactive mode (type text and press Ctrl+D when done)
npm start
```

### Sample Output

```
loading dictionary from: D:\desktop\sprie\data\dictionary.txt
dictionary loaded successfully

checking file: data/sample.txt

found 12 spelling errors:

1. "mispelled" (line 3, column 18)
   suggestions: misspelled

2. "recieve" (line 3, column 40)
   suggestions: believe, receive, recent, recommend

3. "seperate" (line 3, column 54)
   suggestions: separate

4. "definately" (line 4, column 49)
   suggestions: definitely

5. "occured" (line 4, column 66)
   suggestions: occurred, occasion

... (additional errors)
```

## Dictionary Format

Dictionary files should contain one word per line. Lines starting with `#` are treated as comments.

```txt
# Common English words
the
be
to
# Technology terms
computer
algorithm
programming
```

## Project Structure

```
sprie/
├── src/
│   ├── index.ts                 # Main CLI entry point
│   ├── spellChecker.ts          # Core spell checker logic
│   ├── algorithm/
│   │   └── levenshteinDistance.ts  # Edit distance algorithm
│   ├── datastructure/
│   │   └── trie.ts              # Trie implementation
│   └── utils/
│       ├── fileReader.ts        # File I/O utilities
│       └── wordProcesser.ts     # Text processing utilities
├── data/
│   ├── dictionary.txt           # Default dictionary
│   └── sample.txt              # Sample test file
├── dist/                       # Compiled JavaScript (generated)
├── test/
│   └── test.ts                 # Unit tests
├── scripts/
│   └── setup.ts                # Setup script
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture

### Core Components

1. **Trie Data Structure** (`src/datastructure/trie.ts`)
   - Efficient storage and retrieval of dictionary words
   - Prefix-based word suggestions
   - Memory-efficient with shared prefixes

2. **Levenshtein Distance Algorithm** (`src/algorithm/levenshteinDistance.ts`)
   - Calculates edit distance between words
   - Used for generating spell correction suggestions
   - Dynamic programming implementation

3. **Spell Checker Engine** (`src/spellChecker.ts`)
   - Orchestrates the spell checking process
   - Combines Trie and Levenshtein algorithms
   - Handles multiple suggestion strategies

4. **Word Processor** (`src/utils/wordProcesser.ts`)
   - Text normalization and cleaning
   - Word extraction and validation
   - Common word filtering

### Algorithm Overview

1. **Dictionary Loading**: Words are inserted into a Trie for O(m) lookup time where m is word length
2. **Word Extraction**: Text is tokenized and cleaned using regex patterns
3. **Spell Checking**: Each word is checked against the Trie
4. **Suggestion Generation**:
   - Edit distance-based suggestions using dynamic programming
   - Prefix-based suggestions from Trie traversal
   - Suggestions ranked by edit distance (lower is better)

## API Reference

### SpellChecker Class

```typescript
import { SpellChecker, SpellCheckOptions } from './spellChecker';

const options: SpellCheckOptions = {
    maxSuggestions: 5,
    maxDistance: 2,
    customIgnoreWords: ['myterm', 'mycompany']
};

const checker = new SpellChecker(options);

// Load dictionary
checker.loadDictionaryFromFile('path/to/dictionary.txt');

// Check individual word
const result = checker.checkWord('misspelled');
console.log(result.suggestions); // ['misspell', 'misspells', ...]

// Check text
const results = checker.checkText('This has mispelled words');

// Check file
const fileResults = checker.checkFile('document.txt');
```

### Trie Class

```typescript
import { Trie } from './datastructure/trie';

const trie = new Trie();

// Insert words
trie.insert('hello');
trie.insert('world');

// Check if word exists
console.log(trie.contains('hello')); // true

// Get words with prefix
console.log(trie.getWordsWithPrefix('hel')); // ['hello']

// Get suggestions within edit distance
console.log(trie.getWordsWithinDistance('helo', 2)); // ['hello']
```

## Development

### Scripts

```bash
# Build TypeScript to JavaScript
npm run build

# Run unit tests
npm run test

# Clean build directory
npm run clean
```

### Building and Testing

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test with sample file
node dist/src/index.js data/sample.txt

# Test with stdin
echo "helo wrold this is a tset" | node dist/src/index.js

# Run unit tests
node dist/test/test.js
```

### Adding New Features

1. **Custom Algorithms**: Add new suggestion algorithms in `src/algorithm/`
2. **Data Structures**: Implement additional data structures in `src/datastructure/`
3. **Text Processing**: Extend word processing in `src/utils/wordProcesser.ts`
4. **File Formats**: Add support for different file formats in `src/utils/fileReader.ts`

## Performance

- **Dictionary Size**: Handles dictionaries with 10K+ words efficiently
- **Memory Usage**: Trie structure shares common prefixes, reducing memory footprint
- **Speed**: O(m) word lookup time where m is average word length
- **Suggestions**: Dynamic programming for edit distance calculations

## Current Implementation Status

### Implemented Features
- ✅ Core spell checking functionality
- ✅ Trie data structure for dictionary storage
- ✅ Levenshtein distance algorithm for suggestions
- ✅ File and stdin input support
- ✅ Command-line argument parsing
- ✅ Error reporting with line and column numbers
- ✅ Customizable suggestion limits and edit distance
- ✅ Comprehensive dictionary with common English words
- ✅ Unit tests for core functionality

### Known Limitations
- Basic word tokenization (regex-based)
- No phonetic suggestions (Soundex, Metaphone)
- No context-aware suggestions
- No multiple language support
- No real-time spell checking
- No advanced file format support beyond plain text

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Trie data structure implementation for efficient prefix matching
- Levenshtein distance algorithm for edit distance calculations
- TypeScript for type safety and better development experience

## Roadmap

- [ ] Advanced phonetic algorithms (Soundex, Metaphone)
- [ ] Multiple language support
- [ ] Context-aware suggestions
- [ ] Machine learning-based corrections
- [ ] Real-time spell checking
- [ ] Custom rule-based corrections
