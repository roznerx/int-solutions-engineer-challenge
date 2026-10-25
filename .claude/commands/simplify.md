Perform a ruthless simplification review.

Assume this project has evolved through multiple AI-assisted implementations.

Your goal is not to add code.

Your goal is to identify code that should be deleted, merged, simplified, or inlined.

Look for:

1. Unnecessary Abstractions

* wrappers around wrappers
* helper functions used once
* files with very little value
* indirection without benefit

2. Overengineering

* speculative architecture
* future-proofing that is not currently needed
* unnecessary interfaces
* unnecessary layers

3. Redundant Structure

* files that should be merged
* abstractions that duplicate existing abstractions
* utilities that do not justify their existence

4. Simplification Opportunities

* places where fewer files would be better
* places where fewer types would be better
* places where less code would be clearer

For every finding provide:

Location:

* file(s)

Why It Exists:

* likely reason it was introduced

Why It Is Unnecessary:

* explain clearly

Simpler Alternative:

* concrete recommendation

Estimated Reduction:

* files removed
* lines removed
* complexity reduced

IMPORTANT:

* prioritize deletion over addition
* prioritize clarity over abstraction
* assume maintainability is more important than extensibility
* be critical
* do not protect existing abstractions just because they already exist
