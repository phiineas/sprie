#!/usr/bin/env node
"use strict";
/**
 * Setup script for Sprie spell checker
 * This script helps users get started with the project
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSetup = createSetup;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function createSetup() {
    console.log('🚀 Setting up Sprie spell checker...\n');
    // Check if required directories exist
    const requiredDirs = ['src', 'data', 'dist'];
    const missingDirs = [];
    requiredDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            missingDirs.push(dir);
        }
    });
    if (missingDirs.length > 0) {
        console.log('📁 Creating missing directories:');
        missingDirs.forEach(dir => {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`   ✅ Created ${dir}/`);
        });
        console.log();
    }
    // Check for dictionary file
    const dictionaryPath = path.join('data', 'dictionary.txt');
    if (!fs.existsSync(dictionaryPath)) {
        console.log('📚 Dictionary file not found. Creating default dictionary...');
        // This would be created by the other file creation process
        console.log('   ⚠️ Please ensure data/dictionary.txt exists');
        console.log();
    }
    // Check if TypeScript is compiled
    const distExists = fs.existsSync('dist') && fs.readdirSync('dist').length > 0;
    if (!distExists) {
        console.log('🔨 Project needs to be built. Run:');
        console.log('   npm run build');
        console.log();
    }
    // Show usage examples
    console.log('📖 Quick Start:');
    console.log('   # Build the project');
    console.log('   npm run build');
    console.log();
    console.log('   # Test with sample file');
    console.log('   npm run test-file');
    console.log();
    console.log('   # Test with stdin');
    console.log('   npm run test-stdin');
    console.log();
    console.log('   # Run interactive mode');
    console.log('   npm run dev');
    console.log();
    console.log('   # Check a specific file');
    console.log('   npm run dev -- myfile.txt');
    console.log();
    console.log('   # Get help');
    console.log('   npm run dev -- --help');
    console.log();
    console.log('✨ Setup complete! Happy spell checking!');
}
// Run setup if this file is executed directly
if (require.main === module) {
    createSetup();
}
//# sourceMappingURL=setup.js.map