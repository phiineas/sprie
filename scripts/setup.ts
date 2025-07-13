#!/usr/bin/env node

/**
 * Setup script for Sprie spell checker
 * This script helps users get started with the project
 */

import * as fs from 'fs';
import * as path from 'path';

function createSetup(): void {
    console.log('setting up Sprie spell checker...\n');

    // check if required directories exist
    const requiredDirs = ['src', 'data', 'dist'];
    const missingDirs: string[] = [];

    requiredDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            missingDirs.push(dir);
        }
    });

    if (missingDirs.length > 0) {
        console.log('creating missing directories:');
        missingDirs.forEach(dir => {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`   created ${dir}/`);
        });
        console.log();
    }

    // check for dictionary file
    const dictionaryPath = path.join('data', 'dictionary.txt');
    if (!fs.existsSync(dictionaryPath)) {
        console.log('dictionary file not found. creating default dictionary...');
        // this would be created by the other file creation process
        console.log('please ensure data/dictionary.txt exists');
        console.log();
    }

    // check if TypeScript is compiled
    const distExists = fs.existsSync('dist') && fs.readdirSync('dist').length > 0;
    if (!distExists) {
        console.log('project needs to be built. run:');
        console.log('npm run build');
        console.log();
    }

    // show usage examples
    console.log('quick Start:');
    console.log('# build the project');
    console.log('npm run build');
    console.log();
    console.log('# test with sample file');
    console.log('npm run test-file');
    console.log();
    console.log('# test with stdin');
    console.log('npm run test-stdin');
    console.log();
    console.log('# run interactive mode');
    console.log('npm run dev');
    console.log();
    console.log('# check a specific file');
    console.log('npm run dev -- myfile.txt');
    console.log();
    console.log('# get help');
    console.log('npm run dev -- --help');
    console.log();

    console.log('setup complete! happy spell checking!');
}

// run setup if this file is executed directly
if (require.main === module) {
    createSetup();
}

export { createSetup };
