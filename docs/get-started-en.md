<p align="center">
  <a href="https://unicoverso.com/kimu" target="_blank">
    <img src="images/logo_kimu.png" alt="KIMU Logo" width="180" />
  </a>
</p>

# 🚀 Get Started with KIMU Core

Welcome to **KIMU – Keep It Minimal UI Framework**!  

This guide will walk you through the basic steps to download, install, and run the core-framework for the first time.

## 🔧 Prerequisites

Before you start, make sure the following tools are installed on your system:

- [**Git**](https://git-scm.com/) – to clone the repository and manage code versions  
  Recommended: version ≥ 2.30

- [**Node.js**](https://nodejs.org/) – to install and run the project dependencies  
  Recommended: **LTS version** (≥ 18.x)  
  This also includes `npm`, the Node.js package manager

- [**TypeScript**](https://www.typescriptlang.org/) – required for compiling `.ts` files  
  Install localy with:  
  ```bash
  npm install --save-dev typescript
  ```
  Or install globally with: 
  ```bash
  npm install -g typescript
  ```

- (Optional) [**Python 3.x**](https://www.python.org/downloads/) – used in `py-server` script to start a quick static server for distribution files: 
```bash
python3 -m http.server 5173 --directory ./dist
  ```
  
💡 You can verify the installation by running:  
> ```bash
> node -v
> npm -v
> git --version
> ```

If any of these commands fails, please install the corresponding tool from the links above before continuing.


## 📦 1. Clone the Repository

Use Git to clone the project from the official GitHub repository:

```bash
git clone https://github.com/unicoverso/kimu-core.git
cd kimu-core
```


## 📥 2. Install Dependencies

Install all necessary dependencies using `npm`:

```bash
npm install
```


## 🏗️ 3. Build the Project

To generate the full distribution build (TypeScript compilation + configuration + Vite + extensions):

```bash
npm run build
```

This command performs:

- TypeScript compilation
- Configuration generation (for `dev` by default)
- Vite bundling
- Dynamic extension building

You can also run the build with a specific environment:

```bash
npm run build:dev     # Development (default)
npm run build:local   # Local development
npm run build:prod    # Production
```

## ⚙️ 4. (Optional) Advanced Configuration Scripts

If you want to generate the configuration manually without building, you can run:

```bash
npm run generate-config       # Default (development)
```

Other environment variants:

```bash
npm run generate-config:dev     # Development
npm run generate-config:local   # Local
npm run generate-config:test    # Test
npm run generate-config:prod    # Production
```


## 🧹 5. (Optional) Clear Previous Builds

To clean up previous build files:

```bash
npm run clear:build
```


## 🔧 6. Build All Extensions Only

To build all extensions dynamically and prepare them for runtime:

```bash
npm run build:all-ext
```


## 🌐 7. Run the Local Development Server

To preview the Hello App locally and start developing:

```bash
npm start
```

Then open your browser and visit:

```
http://localhost:5173/
```

You should see the **Hello App** running!


## 📁 8. Output Location

After the build process, all compiled files are available in the `dist/` directory.    
This includes:
- Pure JS files (no bundler required)
- HTML, CSS and assets
- Extension files and manifest

These are ready to be served as static files or integrated into your own system.

---

## ✅ What’s Next?

You can now explore:
- How to create your own extension
- How to use the KIMU runtime API
- How to customize the experience

See the full documentation in `docs/` for more.

---

## 💌 Share your thoughts

KIMU is a project built with care, shaped by intention, and carried forward with passion.

If you've used it, explored it, or even just glanced at it — say something.  
A thought, a suggestion, a kind word, or a simple “hello”.

Every message is a beam of light.  
Every word might spark a new extension.  
Every gesture helps fuel this journey.

📬 Send me a message, even just to say *"I see you. Keep going."* 

---

## 🧑‍💻 Author and Contact

Created and maintained by:  
**Marco Di Pasquale** *(aka Hocram)*  
on behalf of the collective **[UnicòVerso](https://unicoverso.com)**

- 🌍 Website: [https://unicoverso.com/kimu](https://unicoverso.com/kimu)  
- 🐙 GitHub: [https://github.com/unicoverso/kimu-core](https://github.com/unicoverso/kimu-core)  
- 🚀 Framework Reference: [https://github.com/unicoverso/kimu](https://github.com/unicoverso/kimu)  
- 📩 Email: [info@unicoverso.com](mailto:info@unicoverso.com)

---

<p>
  <img src="images/icon.svg" alt="KIMU Icon" width="24" style="vertical-align: middle; margin-right: 8px;" />
  Happy coding. Play, create, stay light. Welcome to KIMU!
</p>
