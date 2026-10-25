Perform an architecture review of the entire codebase.

Read all files before making recommendations.

Focus ONLY on:

1. Separation of Concerns

* files doing too many things
* responsibilities in the wrong layer
* business logic in UI
* infrastructure logic in domain code

2. Dependency Direction

* incorrect import relationships
* utilities depending on higher-level modules
* circular dependencies
* hidden coupling

3. Domain Modeling

* duplicate concepts
* competing types representing the same thing
* ownership confusion
* unclear boundaries

4. Folder Structure

* files in the wrong location
* opportunities to improve organization
* feature boundaries

5. Maintainability Risks

* areas likely to become difficult to evolve
* fragile dependencies
* hidden assumptions

For every finding provide:

Severity:

* High
* Medium
* Low

Location:

* file(s)

Problem:

* explain the architectural concern

Recommended Change:

* specific implementation

Tradeoffs:

* advantages
* disadvantages

IMPORTANT:

* do not redesign the entire application
* work within the existing architecture
* prefer incremental improvements
* avoid theoretical purity
