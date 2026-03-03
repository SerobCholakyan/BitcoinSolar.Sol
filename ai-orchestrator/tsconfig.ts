{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src/index.ts",
    "src/agents/**/*",
    "src/executor/**/*",
    "src/state/**/*",
    "src/config/**/*"
  ],
  "exclude": [
    "src/webapp/**/*"
  ]
}
