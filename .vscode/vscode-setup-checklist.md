# VS Code Environment Validation Checklist

## 1. VS Code Version
- [ ] Running latest stable VS Code version  
- [ ] Check via **Help → About**

## 2. Built-in Extensions
- [ ] **TypeScript and JavaScript Language Features** enabled  
- [ ] ESLint (if used) enabled  
- [ ] Verify with `@builtin` filter in Extensions panel

## 3. Workspace Trust
- [ ] Workspace is trusted (no "Restricted Mode" warnings)

## 4. Correct Workspace Folder
- [ ] Opened project root or relevant folder only  
- [ ] Avoid unrelated parent folders

## 5. TypeScript Version
- [ ] Open a `.ts` or `.tsx` file  
- [ ] Run Command Palette: **Select TypeScript Version**  
- [ ] Using workspace TS version if available

## 6. `tsconfig.json`
- [ ] Present at workspace root or relevant folder  
- [ ] Valid compiler options and paths  
- [ ] Run `tsc --noEmit` in terminal → no errors

## 7. Path Aliases & Imports
- [ ] `tsconfig.json` and bundler alias config match  
- [ ] File names case-sensitive correct (especially `index.ts`)  
- [ ] Aliases resolve correctly in imports

## 8. Extension Conflicts
- [ ] Disable non-essential extensions to test  
- [ ] Restart VS Code and re-enable extensions one-by-one

## 9. Reload VS Code Window
- [ ] Use Command Palette → **Reload Window** after config changes

## 10. Check Logs & Problems
- [ ] Open **TypeScript: Open TS Server Log** for TS issues  
- [ ] Monitor Problems panel for errors or warnings

---

## Bonus Tips
- Use **Settings Sync** extension for consistent configs  
- Use **Project Manager** extension for easy workspace switching  
- Use **ESLint** and **Prettier** for code quality checks

---

**Keep this checklist handy to quickly validate your VS Code environment and avoid common setup pitfalls!**
