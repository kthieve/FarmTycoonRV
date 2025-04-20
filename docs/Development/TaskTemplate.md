# Task Template

Use this template to define tasks for your 30-60 minute development sessions. Each task should be focused and achievable within a single session.

## Task Information

```markdown
# Task: [Task Name]

## Basic Information
- **ID**: [YYYY-MM-DD-NN]
- **Type**: [Feature/Bug/Refactor/Documentation]
- **Estimated Time**: [30/45/60 minutes]
- **Milestone**: [Reference to milestone from roadmap]
- **Priority**: [High/Medium/Low]

## Description
Brief description of the task.

## Objective
Clear statement of what needs to be accomplished.

## Acceptance Criteria
- Criterion 1
- Criterion 2
- Criterion 3

## Implementation Notes
- Note relevant files/systems to modify
- Document design considerations
- List potential challenges

## Dependencies
- List any tasks that must be completed first
- Note any resources needed

## Testing Plan
- How to verify this task is complete
- Specific test cases to check

## Next Steps
- What tasks logically follow this one
- Additional related work that might be needed later
```

## Example Task

```markdown
# Task: Implement Basic Crop Growth System

## Basic Information
- **ID**: 2023-08-15-01
- **Type**: Feature
- **Estimated Time**: 45 minutes
- **Milestone**: Phase 2 - Crop System
- **Priority**: High

## Description
Create the basic crop growth system that handles the progression of crops through their growth stages over time.

## Objective
Implement a system that allows crops to grow through multiple stages based on in-game time passage.

## Acceptance Criteria
- Crops progress through defined growth stages
- Growth speed is configurable per crop type
- Growth stage is visibly represented on the farm plot
- Growth can be affected by watering status

## Implementation Notes
- Modify `CropSystem.gd` to handle growth logic
- Update `FarmPlot.gd` to display current growth stage
- Create growth stage enum in `CropData.gd`
- Consider using a timer system connected to game day events

## Dependencies
- Farm plot system must be complete
- Time system must be operational
- Basic crop data structure must exist

## Testing Plan
- Plant a test crop and advance time to verify growth
- Test with different crop types to ensure varying growth rates
- Check that watered vs. unwatered crops grow at different rates

## Next Steps
- Implement fertilizer effects on growth
- Add seasonal effects on growth rates
- Create harvesting mechanics
```

## Task Naming Convention

Use the following format for task file names:
`YYYY-MM-DD-NN-task-name.md`

Where:
- `YYYY-MM-DD` is the date the task was created
- `NN` is a two-digit sequence number for that day
- `task-name` is a brief kebab-case description

Example: `2023-08-15-01-implement-crop-growth.md`

## Task Organization

Tasks should be stored in the following directory structure:

```
/docs/Development/Tasks/
├── Backlog/
├── NextUp/
├── InProgress/
├── Review/
└── Done/
```

Move task files between directories as their status changes. 