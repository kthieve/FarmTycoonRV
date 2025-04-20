# Asset Guidelines

This document outlines the guidelines for creating and managing assets for Farm Tycoon Revisited.

## General Asset Guidelines

### File Formats
- **Graphics**: SVG preferred for UI and game elements, PNG as fallback (at appropriate resolutions)
- **Audio**: OGG for music, WAV for sound effects
- **Animations**: Godot animation system, SVG where possible
- **Fonts**: TTF or OTF
- **Data**: JSON for configuration files

### Naming Conventions
- Use lowercase with underscores (snake_case)
- Use descriptive names that indicate purpose and type
- Follow the pattern: `category_subcategory_descriptor_variant.extension`
- Examples:
  - `crop_tomato_stage1.svg`
  - `ui_button_shop_hover.svg`
  - `sfx_tool_watering.wav`
  - `music_season_summer.ogg`

### Organization
Assets should be organized in the following directory structure:
```
/assets
├── graphics
│   ├── characters
│   ├── crops
│   ├── environment
│   ├── items
│   ├── tools
│   └── ui
├── audio
│   ├── music
│   ├── sfx
│   └── ambient
├── fonts
├── animations
└── data
```

## Visual Style Guidelines

### Art Style
- 2D with a clean, colorful aesthetic
- Slightly stylized (not photorealistic, not overly cartoonish)
- Consistent line weights and color palette
- Clear silhouettes and easily recognizable elements
- Scalable design for different screen resolutions

### Color Palette

#### Primary Colors
```
Main Green: #4CAF50 (Primary farming/growth theme)
Earth Brown: #795548 (Soil, earth elements)
Sky Blue: #2196F3 (Water, sky elements)
Warm Yellow: #FFC107 (Sun, harvest elements)
Wood Brown: #8D6E63 (Tool handles, structures)
```

#### Seasonal Palettes
```
Summer: Bright, saturated colors (#FF9800, #F44336, #FFEB3B)
Monsoon: Blues and greens (#0288D1, #26A69A, #78909C)
Autumn: Warm, earthy tones (#FF5722, #8D6E63, #FFA000)
Winter: Cool, muted colors (#90A4AE, #B0BEC5, #CFD8DC, #ECEFF1)
Spring: Soft pastels (#9C27B0, #8BC34A, #E91E63, #CDDC39)
```

#### UI Colors
```
Background: #F5F5F5
Primary UI: #3F51B5
Accent: #FF4081
Text Dark: #212121
Text Light: #FFFFFF
```

### Visual Elements

#### Characters
- Consistent proportions (approximately 2-3 "heads" tall)
- Distinctive silhouettes
- Simple but expressive faces
- Limited animation frames but with personality

#### Crops
- Clear visual progression between growth stages
- Distinctive shapes for different crop types
- Quality levels indicated by subtle visual enhancements (size, color vibrancy)
- Seasonal variants where appropriate

#### Environment
- Tile-based design for farm plots
- Clear visual states for different plot conditions
- Seasonal variations for all environmental elements
- Weather effects that don't obscure gameplay elements

#### UI Elements
- Clean, flat design with minimal shadows
- Consistent corner rounding and border treatments
- Clear iconography with universal understandability
- Responsive layouts that work on different screen sizes

## Audio Guidelines

### Music
- Ambient, relaxing background tracks
- Thematic variations for different:
  - Locations (farm, shop, home, etc.)
  - Seasons
  - Time of day
- 1-3 minute loops that blend seamlessly
- Instrumentation that fits farming theme (acoustic, folk-inspired)

### Sound Effects
- Functional audio feedback for all interactions
- Distinctive sounds for different tools and actions
- Layered design for complex actions
- Appropriate volume levels that don't dominate the experience

### Implementation Notes
- Dynamic audio mixing based on game context
- Fade transitions between music tracks
- Optional volume controls for music and SFX separately
- Consideration for device speakers and headphones

## Animation Guidelines

### Character Animations
- Walking (4 directions)
- Tool usage (specific to each tool)
- Idle animations
- Interaction animations
- Tired/low energy state

### Environment Animations
- Crop growth transitions
- Weather effects
- Water movement
- Seasonal transitions

### UI Animations
- Button feedback
- Transitions between screens
- Popup notifications
- Achievement unlocks

### Implementation Notes
- Keep animations simple and performant
- Use sprite sheets for complex animations
- Consider reduced animations option for lower-end devices

## Accessibility Considerations

- Minimum text size of 16pt equivalent
- High contrast option for UI elements
- Test designs in grayscale for color blindness compatibility
- Audio design that works without relying solely on sound cues
- Touch targets of at least 44×44 pixels for mobile

## Asset Creation Workflow

1. **Concept**: Sketch and define the asset's purpose and visual style
2. **Creation**: Develop the asset using appropriate tools (Inkscape for SVG, etc.)
3. **Review**: Check against style guidelines and technical requirements
4. **Implementation**: Import into Godot and test in-game
5. **Iteration**: Refine based on in-game appearance and functionality
6. **Documentation**: Add to asset tracking system with metadata

## Asset Management

- Track all assets in a shared spreadsheet or database
- Include metadata like:
  - Purpose/usage
  - Creation date
  - Creator
  - License information (if applicable)
  - Dependencies
- Version control all assets alongside code
- Create backups of raw asset files (e.g., Inkscape SVG before export) 