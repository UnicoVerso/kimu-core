# 🧩 KIMU Coding Guidelines

## 🎯 Purpose

This document provides guidelines and best practices for writing code and developing features within the **KIMU – Keep It Minimal UI Framework**.
Its goal is to ensure consistency, readability, maintainability, and simplicity across the entire project.

---

## ✨ Core Principles

* **Minimalism first**: Write only what is necessary. Avoid over-engineering.
* **Clarity over cleverness**: Code should be easy to read and understand, even for new contributors.
* **Consistency**: Follow established naming conventions, file structures, and component patterns.
* **Composable and modular**: Keep components and functions focused on a single responsibility.
* **Lightweight mindset**: Prefer simple solutions with minimal dependencies.

---

## 📝 Code Style

* Use **camelCase** for variables and function names.
* Use **PascalCase** for component names and classes.
* Follow the existing folder structure and naming patterns.
* Write **self-explanatory function and variable names**.
* Keep functions **small and focused**.
* Add comments where logic is non-trivial.
* Use **whitespace and indentation** to enhance readability.

---

## 🏷️ Naming Conventions and Code Structure

KIMU follows simple and consistent naming rules to ensure readability and predictability.

### 🟢 Variables and Functions

* Use **camelCase** for variable names and function names.

  ```js
  let userList = [];
  function fetchData() { ... }
  ```

### 🟢 Classes and Components

* Use **PascalCase** for component names and class declarations.

  ```js
  class KimuButton { ... }
  export class UserProfileCard { ... }
  ```

### 🟢 Constants

* Use **UPPER\_SNAKE\_CASE** for global constants.

  ```js
  const API_ENDPOINT = '/api/v1/data';
  ```

### 🟢 File and Folder Names

* Use **kebab-case** for file and folder names.

  ```bash
  /user-profile-card/
  user-profile-card.component.js
  ```

### 🟢 Methods inside Classes

* Use **camelCase** for method names.

  ```js
  class KimuButton {
    handleClick() { ... }
  }
  ```

### 🟢 Events and Custom Attributes

* Use **kebab-case** for custom events and HTML attributes.

  ```html
  <kimu-button @click="handleClick" data-user-id="123"></kimu-button>
  ```

### 🟢 Private Variables and Methods

* Prefix with an underscore `_` for private-like semantics.

  ```js
  class UserProfile {
    _validateData() { ... }
  }
  ```

---

## ✅ Why Naming Matters

Consistent naming helps:

* Understand code faster.
* Reduce cognitive load.
* Maintain a clean and professional codebase.

KIMU values clarity and simplicity. Every name should tell a story of its purpose.

---

## 🧩 Components and Files

* Each UI component should live in its **own folder**, with related styles and templates.
* Reuse existing utilities and helpers where possible.
* Avoid duplicating logic — prefer shared services and composable functions.

---

## 🧪 Testing and Validation

* Ensure new features are tested, especially critical or shared functionalities.
* Run existing tests before submitting a Pull Request.
* Manual testing is encouraged for UI interactions and visual changes.

---

## 📖 Documentation

* Update or create documentation for any new feature, component, or API.
* Keep README files up to date in each module or component folder.

---

## ✅ Commit Guidelines

* Use clear and concise commit messages.
* Follow this format:

  ```
  [type]: short description

  [optional body with more context]
  ```

  Examples of types: `fix`, `feature`, `refactor`, `docs`, `chore`

---

## 🙏 Why It Matters

Following these guidelines ensures KIMU remains:

* **Easy to understand** for new contributors.
* **Simple to maintain** and extend.
* **Consistent and reliable** across all modules.

Thank you for writing code that reflects the KIMU philosophy of minimal, meaningful design.

---

For any questions or clarifications, please reach out via [GitHub Issues](https://github.com/unicoverso/kimu/issues) or contact the maintainer.

Marco Di Pasquale - Hocram (UnicòVerso)
