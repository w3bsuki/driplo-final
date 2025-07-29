# Test File for Claude Action

This is a test file to trigger the Claude Code GitHub Action.

```javascript
// Intentionally problematic code for Claude to review
function badCode() {
    var x = 1;
    var x = 2; // duplicate declaration
    if (x = 3) { // assignment instead of comparison
        console.log("This is bad")
    }
}
```