# Auto Design Tokens Optimizer

Automatically adjusts **design tokens**, improves **color contrast**,  
and performs **hue/lightness/saturation corrections** for consistent and accessible UI design.

## ✨ Features

### 1. Design Tokens First
This library assumes:

> **"Adjust design tokens first → automatically optimize based on rules"**

### 2. Automatic Contrast Adjustment
Ensures readable text by checking luminance ratio.

### 3. Hue / Lightness / Saturation Tweaks
Small adjustments for:

- Better harmony between components  
- Brand color normalization  
- Consistent palette across the site  

### 4. PostCSS Plugin Included
Use it directly on:

- `:root { --color-primary: #3498db }`
- `.btn { background: #3498db }`

The plugin will auto-correct and insert safe text colors.

---