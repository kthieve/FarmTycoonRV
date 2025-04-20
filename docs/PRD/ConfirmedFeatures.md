# Confirmed Features

This document outlines all confirmed features for Farm Tycoon Revisited. These features form the core game experience and are committed for implementation.

## Core Gameplay Systems

### Farm Management
- **Grid-based Farm Plots**: Each farm land is divided into a grid of individual patches
- **Patch States**: Untilled, tilled, planted (with different growth stages), watered, fertilized
- **Obstacles**: Rocks, timber, and weeds that must be cleared
- **Multiple Farmlands**: Player can purchase additional farm plots as they progress

### Crop System
- **Diverse Crop Types**: Various fruits and vegetables with different:
  - Growth times
  - Selling prices
  - Seasonal preferences
  - Water/fertilizer needs
- **Growth Stages**: Seeds → Sapling → Plant → Flower → Fruit → Harvestable
- **Harvest Mechanics**: Use tools to harvest crops when ready

### Time & Energy Management
- **Day/Night Cycle**: Activities can only be performed during the day
- **Stamina System**: Activities consume stamina, which regenerates after sleep
- **Time Progression**: Actions consume time, different locations advance time differently
- **Weekly/Monthly Cycles**: Connected to seasons and events

### Economic System
- **Buying & Selling**: Purchase seeds, tools, upgrades; sell harvested crops
- **Price Fluctuations**: Market prices change based on supply/demand and events
- **Warehouse Storage**: Store produce with degrading quality over time
- **Special Orders**: Complete specific crop requests for bonus rewards

### Weather & Seasons
- **Five Distinct Seasons**: Summer, Monsoon, Autumn, Winter, Spring
- **Weather Events**: Rain, storms, floods, blizzards, etc.
- **Seasonal Effects**: On crop growth, stamina consumption, and available activities
- **Natural Disasters**: Can damage crops and farm infrastructure

### Tool System
- **Basic Tools**:
  - Watering can: Waters plants
  - Hoe: Harvest fruits, cut plants and weeds
  - Shovel: Till land, clean land
  - Axe: Cut timber
  - Pickaxe: Mine stone/rock
- **Tool Upgrades**: Improve efficiency and reduce stamina consumption

## Character & Relationship Systems

### Shopkeeper Relationship
- **Relationship Meter**: Track your standing with the shopkeeper
- **Gift System**: Give presents to improve relationship
- **Special Requests**: Complete personal tasks for relationship points
- **Dialogue System**: Simple conversation options that affect relationship

### Player Character
- **Health System**: Becoming sick affects work efficiency
- **Customization**: Basic appearance options
- **Skill Progression**: Improve farming abilities through experience

## World & Environment

### Locations
- **Farm**: Where crops are grown and tended
- **Shop**: For buying/selling and interacting with shopkeeper
- **Warehouse**: For storing harvested crops
- **Home**: For sleeping, saving, and personal storage
- **Pawnshop**: For buying special items and gifts

### UI & Accessibility
- **Intuitive Interface**: Clear indicators for time, stamina, inventory
- **Tutorial System**: Guided introduction to game mechanics
- **Save System**: Multiple save slots with import/export capability
- **Cross-platform Support**: Android, Windows/Linux, and web browser

## Technical Specifications
- **Godot Engine**: Developed using Godot for cross-platform compatibility
- **SVG Graphics**: Scalable vector graphics for most visual elements
- **Landscape Orientation**: Optimized for landscape view on all devices
- **Data Persistence**: Save files with export/import capability 