# Graph Report - pedigree-be  (2026-08-02)

## Corpus Check
- 16 files · ~3,115 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 65 nodes · 85 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0267c2c9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Achievement Module
- App & Route Wiring
- Pedigree Module
- Animal Create/Delete
- Auth & Core Library
- Animal Status Methods
- Animal Routes

## God Nodes (most connected - your core abstractions)
1. `AnimalService` - 11 edges
2. `AchievementService` - 7 edges
3. `elysia` - 4 edges
4. `PedigreeService` - 4 edges
5. `getTreeQuery` - 3 edges
6. `animalRoute` - 2 edges
7. `app` - 2 edges
8. `listAchievementQuery` - 2 edges
9. `updateAchievementBody` - 2 edges
10. `createAchievementBody` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (8 total, 1 thin omitted)

### Community 0 - "Achievement Module"
Cohesion: 0.39
Nodes (6): createAchievementBody, deleteAchievementBody, listAchievementQuery, updateAchievementBody, achievementService, prisma

### Community 1 - "App & Route Wiring"
Cohesion: 0.23
Nodes (7): app, achievementRoute, listAnimalTypeQuery, animalTypeRoute, pedigreeRoute, pedigreeService, prisma

### Community 2 - "Pedigree Module"
Cohesion: 0.32
Nodes (4): getTreeQuery, getPedigreeTree(), PedigreeService, TreeNode

### Community 3 - "Animal Create/Delete"
Cohesion: 0.40
Nodes (4): createAnimalBody, deleteAnimalBody, listAnimalQuery, updateAnimalBody

### Community 4 - "Auth & Core Library"
Cohesion: 0.33
Nodes (5): authRoute, prisma, TODO: Uncomment these lines for production, temporarily disabled for testing, elysia, jwtBodySchema

### Community 5 - "Animal Status Methods"
Cohesion: 0.13
Nodes (5): animalRoute, animalService, prisma, AnimalService, StatusDistributionItem

## Knowledge Gaps
- **14 isolated node(s):** `prisma`, `animalService`, `StatusDistributionItem`, `prisma`, `achievementService` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AchievementService` connect `Animal Routes` to `Achievement Module`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `PedigreeService` connect `Pedigree Module` to `App & Route Wiring`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `prisma`, `animalService`, `StatusDistributionItem` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Animal Status Methods` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._