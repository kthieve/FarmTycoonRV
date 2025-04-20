# Farm Tycoon Revisited - Game Design Document

## 1. Game Concept

Farm Tycoon Revisited is a modern reimagining of the classic J2ME game Farm Tycoon. Players take on the role of a new farmer aiming to build a thriving farm, manage resources effectively, navigate seasonal challenges, and develop a relationship with the local shopkeeper. The game combines farming simulation with time/resource management and light relationship mechanics.

### Core Pillars
- **Farming Simulation**: Planting, growing, and harvesting crops in a dynamic environment
- **Resource Management**: Balancing time, energy, money, and inventory
- **Weather & Seasons**: Adapting to changing conditions that affect gameplay
- **Economic Strategy**: Making smart decisions about what to grow and when to sell
- **Character Development**: Building relationships and improving skills over time

## 2. Gameplay Systems

### 2.1 Farm Management

#### Farm Plot System
- Grid-based farm plots divided into individual cells
- Multiple farm plots can be purchased and managed simultaneously
- Each cell can be in various states (untilled, tilled, planted, watered, etc.)
- Obstacles like rocks, timber, and weeds must be cleared

#### Crop System
- Diverse selection of crops with unique properties:
  - Growth time
  - Water requirements
  - Seasonal preferences
  - Value and market demand
  - Special properties (gift value, recipe ingredient, etc.)
- Growth stages: seed → sapling → plant → flower → fruit → harvest
- Quality levels affected by care, weather, and soil conditions
- Crop rotation benefits for soil health and yield

#### Tool System
- Basic tools with specific functions:
  - **Watering Can**: Waters plants
  - **Hoe**: Harvests crops, cuts plants, removes weeds
  - **Shovel**: Tills land, cleans land
  - **Axe**: Cuts timber
  - **Pickaxe**: Mines rocks
- Tools can be upgraded to improve efficiency and reduce stamina usage
- Special tools can be unlocked or rented for specific tasks

### 2.2 Time & Energy Management

#### Day/Night Cycle
- Days divided into morning, afternoon, and evening
- Time advances with actions at different rates
- Limited daylight hours for outdoor activities
- Return home to sleep and advance to the next day

#### Stamina System
- Actions consume varying amounts of stamina
- Running out of stamina reduces movement speed and work efficiency
- Stamina replenishes after sleep
- Food items can restore stamina during the day
- Weather and health conditions affect stamina consumption

#### Calendar System
- Week-based progression (5-7 days per week)
- Month-based seasonal transitions (5-6 weeks per month)
- Year tracking for long-term progress
- Special events and festivals on specific dates

### 2.3 Economic System

#### Shop Mechanics
- Buy seeds, tools, upgrades, and gifts
- Sell harvested crops and processed goods
- Dynamic pricing based on supply/demand and seasons
- Special orders with premium prices

#### Price Fluctuation
- Daily and weekly price changes
- Seasonal effects on crop values
- Supply and demand mechanics
- Special events that affect market prices
- Newspaper provides price forecasts

#### Storage System
- Warehouse for storing harvested crops
- Quality degradation over time
- Storage improvements to slow degradation
- Limited storage capacity requiring expansion

### 2.4 Weather & Seasons

#### Five Seasons
1. **Summer**
   - Hot temperatures
   - Occasional storms
   - Higher stamina consumption
   - Best for heat-loving crops
   - Fire spirit events

2. **Monsoon**
   - Frequent rain and storms
   - Potential flooding
   - Reduced need for watering
   - Water-loving crops thrive
   - Water spirit events

3. **Autumn**
   - Mild temperatures
   - Occasional rain
   - Harvest festival season
   - Best for many staple crops
   - Earth spirit events

4. **Winter**
   - Cold temperatures
   - Snow and blizzards
   - Higher stamina consumption
   - Limited crop options
   - Ice spirit events

5. **Spring**
   - Mild temperatures
   - Wind and occasional rain
   - Pollination events
   - Flower-growing season
   - Air spirit events

#### Weather Events
- **Rain**: Automatically waters crops
- **Storm**: Potential crop damage, limited outdoor time
- **Flood**: Waterlogged farm plots requiring drainage
- **Blizzard**: Potential crop death, stamina penalties
- **Wind**: Pollination benefits, potential damage to delicate crops
- **Drought**: Increased watering needs (summer special event)

### 2.5 Relationship System

#### Shopkeeper Interaction
- Friendship meter tracking relationship level
- Daily conversations for small relationship boosts
- Gift-giving with preference system
- Special requests to fulfill for significant relationship points
- Romance progression with milestone events

#### Relationship Benefits
- Better prices at the shop
- Access to exclusive items
- Special orders with premium rewards
- Help during disasters or difficult times
- Endgame romance storyline

## 3. Progression Systems

### 3.1 Farm Expansion
- Start with a small farm plot
- Purchase additional land as you earn money
- Unlock new areas with unique properties (riverside, hillside, etc.)
- Upgrade farm buildings and infrastructure

### 3.2 Tool Upgrades
- Basic tools can be upgraded multiple times
- Improvements reduce stamina usage
- Increase work speed and efficiency
- Unlock special functions

### 3.3 Skill Development
- Farming skill improves with practice
- Higher skill levels improve crop quality and yields
- Unlock special techniques and abilities
- Reduce stamina consumption for familiar tasks

### 3.4 Story Milestones
- Complete specific achievements to advance the story
- Seasonal festivals and events
- Building relationship with the shopkeeper
- Discovering the history and secrets of the farm

## 4. User Interface

### 4.1 Main HUD
- Time and date display
- Stamina meter
- Current tool selection
- Weather indicator
- Money display
- Quick inventory access

### 4.2 Farm View
- Grid-based farm layout
- Visual indicators for plot states
- Crop growth visualization
- Obstacle and feature indicators

### 4.3 Inventory System
- Category-based item organization
- Item details and descriptions
- Usage options for items
- Storage capacity limits

### 4.4 Shop Interface
- Buy/sell tabs
- Item categories
- Price information
- Special order board
- Relationship indicator

## 5. Art Style & Audio

### 5.1 Visual Style
- 2D with SVG graphics for scalability
- Colorful and appealing to all ages
- Clear visual distinctions between seasons
- Easily readable farm plot states
- Expressive character designs

### 5.2 Audio Design
- Relaxing background music varying by location and season
- Functional sound effects for actions and tools
- Weather ambient sounds
- UI feedback sounds
- Special event music

## 6. Technical Implementation

### 6.1 Target Platforms
- Android mobile devices
- Windows/Linux desktop
- Web browser (HTML5)

### 6.2 Engine Features
- Godot Engine for cross-platform development
- SVG graphics for clean scaling on different devices
- Save system with cloud synchronization
- Optimized for both touch and keyboard/mouse controls

### 6.3 Performance Considerations
- Efficient entity management for mobile
- Optimized rendering for large farm plots
- Intelligent time simulation when inactive

## 7. Monetization (For Future Consideration)

### 7.1 Premium Model
- One-time purchase
- No in-app purchases
- Potential for DLC expansion packs

### 7.2 Free-to-Play Alternative
- Base game free
- Optional time-savers or cosmetic items
- No pay-to-win mechanics
- Ad-free experience option

## 8. Development Priorities

### 8.1 Core Gameplay Loop (MVP)
1. Basic farm plot system
2. Time and stamina mechanics
3. Simple crop growth system
4. Basic shop functionality
5. Day/night cycle
6. Essential tools implementation

### 8.2 Secondary Features
1. Weather and seasons
2. Expanded crop variety
3. Tool upgrades
4. Basic relationship system
5. Farm expansion

### 8.3 Polish and Expansion
1. Advanced economic systems
2. Full relationship storyline
3. Special events and festivals
4. Achievement system
5. Additional farm areas 