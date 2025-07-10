import * as fs from 'fs';
import * as path from 'path';

export class FileReader {
    static readFile(filePath: string): string {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`file not found- ${filePath}`);
            }
            
            const absolutePath = path.resolve(filePath);
            return fs.readFileSync(absolutePath, 'utf8');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`error reading file ${filePath}- ${message}`);
        }
    }

    static readLines(filePath: string): string[] {
        const content = this.readFile(filePath);
        return content.split('\n').filter(line => line.trim().length > 0);
    }

    static writeFile(filePath: string, content: string): void {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`error writing file ${filePath}- ${message}`);
        }
    }

    static appendFile(filePath: string, content: string): void {
        try {
            fs.appendFileSync(filePath, content, 'utf8');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`error appending to file ${filePath}- ${message}`);
        }
    }

    static fileExists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    static getFileSize(filePath: string): number {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`error getting file size ${filePath}- ${message}`);
        }
    }
}
