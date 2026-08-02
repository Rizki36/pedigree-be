# Graph Report - .  (2026-08-02)

## Corpus Check
- Corpus is ~3,135 words - fits in a single context window. You may not need a graph.

## Summary
- 65 nodes · 110 edges · 10 communities (6 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Achievement Module
- App & Route Wiring
- Pedigree Module
- Animal Create/Delete
- Auth & Core Library
- Animal Status Methods
- Animal Routes
- Animal List Query
- Animal Update Operation

## God Nodes (most connected - your core abstractions)
1. `AnimalService` - 11 edges
2. `AchievementService` - 7 edges
3. `elysia` - 5 edges
4. `listAchievementQuery` - 4 edges
5. `updateAchievementBody` - 4 edges
6. `createAchievementBody` - 4 edges
7. `deleteAchievementBody` - 4 edges
8. `listAnimalQuery` - 4 edges
9. `updateAnimalBody` - 4 edges
10. `createAnimalBody` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (10 total, 4 thin omitted)

### Community 0 - "Achievement Module"
Cohesion: 0.27
Nodes (7): createAchievementBody, deleteAchievementBody, listAchievementQuery, updateAchievementBody, achievementService, prisma, AchievementService

### Community 1 - "App & Route Wiring"
Cohesion: 0.21
Nodes (8): app, achievementRoute, animalRoute, listAnimalTypeQuery, animalTypeRoute, pedigreeRoute, pedigreeService, prisma

### Community 2 - "Pedigree Module"
Cohesion: 0.32
Nodes (4): getTreeQuery, getPedigreeTree(), PedigreeService, TreeNode

### Community 3 - "Animal Create/Delete"
Cohesion: 0.38
Nodes (3): createAnimalBody, deleteAnimalBody, StatusDistributionItem

### Community 4 - "Auth & Core Library"
Cohesion: 0.33
Nodes (5): authRoute, prisma, TODO: Uncomment these lines for production, temporarily disabled for testing, elysia, jwtBodySchema

## Knowledge Gaps
- **10 isolated node(s):** `prisma`, `achievementService`, `prisma`, `animalService`, `StatusDistributionItem` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AnimalService` connect `Animal Status Methods` to `Animal Update Operation`, `Animal Create/Delete`, `Animal Routes`, `Animal List Query`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `elysia` connect `Auth & Core Library` to `Achievement Module`, `App & Route Wiring`, `Animal Routes`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **What connects `prisma`, `achievementService`, `prisma` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._