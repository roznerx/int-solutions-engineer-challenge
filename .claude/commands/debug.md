Perform a comprehensive correctness review of the entire codebase.

Read all files before making recommendations.

Focus ONLY on:

1. Bugs

* logic errors
* incorrect assumptions
* edge cases
* off-by-one issues
* stale state
* race conditions
* async issues
* improper error handling

2. Type Safety

* unsafe casts
* use of any
* use of never to bypass typing
* incorrect TypeScript assumptions
* missing runtime validation

3. Dead Code

* unused files
* unused exports
* unused functions
* unreachable code
* obsolete abstractions
* code paths that can never execute

4. Error Handling

* swallowed errors
* missing try/catch blocks
* inconsistent error handling
* places where failures can leave invalid state

For every finding provide:

Severity:

* Critical
* High
* Medium
* Low

Location:

* file
* function

Problem:

* explain precisely

Recommended Fix:

* concrete implementation

Expected Benefit:

* why the fix matters

IMPORTANT:

* focus on actual correctness issues
* avoid style comments
* avoid architecture discussions
* avoid performance discussions
* identify real code locations before making recommendations

Rank findings by severity.
