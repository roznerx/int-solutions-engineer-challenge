Perform a duplication and complexity review of the entire codebase.

Read all files before making recommendations.

Focus ONLY on:

1. Duplicate Code

* repeated utility functions
* repeated business logic
* repeated validation logic
* repeated transformations
* repeated API patterns
* repeated string normalization logic

For every duplicate:

* show all locations
* identify the canonical implementation
* propose a single source of truth

2. Complexity Hotspots

* large functions
* deeply nested conditionals
* excessive branching
* difficult-to-follow code paths
* unnecessary abstraction layers

3. Algorithmic Complexity

* unnecessary O(n²) behavior
* repeated loops over the same collections
* repeated database lookups
* repeated filtering/mapping
* opportunities to use Maps/Sets

For every finding provide:

Location:

* file
* function

Current Complexity:

* explain the implementation

Proposed Simplification:

* explain the alternative

Expected Benefit:

* readability
* maintainability
* performance

IMPORTANT:

* focus on meaningful complexity
* do not recommend abstractions that increase code size
* prefer simpler code over clever code
* prioritize maintainability
