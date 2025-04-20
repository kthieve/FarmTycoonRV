# Farm Tycoon Revisited

Farm tycoon is a simple j2me farm management game developed by _____
Goal of the games are:
    -   Manage farmlands
    -   grow fruits
    -   sell fruits to shopkeeper
    -   use money to buy seeds
    -   use money for upgrade
    -   provide gifts to shopkeeper to win her
    -   manage stamina and time during day
    -   manage inventory
    -   be smart about changing prices
    -   seasons introduce different plants
    -   natural disasters can cause harm to farmlands
    -   becoming sick makes you work less efficiently
    -   buy new lands to cultivate



Features:
    - seasons have effects, stamina (buy cloths, later add more mechanics like feeling cold drink hot chocolate, shorter daytime)
    - prices of the food in the market fluctuates, you can buy newspaper to learn about possible events in the week, like chance of rain/storm and the price fluctuation graph
    - events can cause positive effect in farming or ruin it. like storm can break some patches of farm, rain doesnt need to water farm patches


Mechanics:
    - Farmland - grid like farm patches per piece of land each patch can hold one plant. and we use the tools on the patches for effect
    - Multiple farmland can be purchased
    - Farm Patches - can be in the state of 
        - untilted
        - tilted
        - planted - seed, sapling, plant, flower, fruit - stage 1, stage 2, full grownth
        - rock
        - timber
        - weed
        - flooded
        - watered/unwatered
        - fertilized (boost groth), normal, barren (needs treatment )
        - Destroyed/diseased plant
    - shopkeeper - where you sell your produce, sometimes shopkeeper can forward request orders from others
    - warehouse - store the produce for some time, quality -> price decreases as days go and finally rots away 
    - Pawnshop - Buy gifts and special items 
    - Romance - With shopkeeper. chat and fill orders, gift, improve relationship with random tasks like helpiong others
    - Time - each day has time limit which runs out gradually when at farm, going to other places reduces time. can only stay home and warehouse at night.
    - Days - Each day the farmer can work, then there is a week, at each week there is an option to read newspaper. each month has 5-6 weeks each season is a month
    - Seasons - There are five seasons - summer (lots of storms, occational rain, summer festivals, fire spirit), monsoon ( many rainy days, floods, storms, Water spirit events - future feature) autumn (some rainy days, some storms, harvest season, harvest festivals, earth spirit) winter (blizzard and cold and snow, low harvest and only some plants, disease due to cold, winter events, ice spirit) spring (calm weather, pollination gusts, more common cold and diseases, spring festivals, air spirit)
    - Tools - there are initially multiple tools
      - Watering can - waters plants
      - hoe - harvest fruit, cut plants, cut weeds
      - Shovel - tilt land, clean land
      - axe - cut timber 
      - pump - rentable to remove flood water (due to rain or flood)
      - pickaxe - mine stone/rock
      - garbage_bag - store garbage (purchasable)
    

Gameplay loop:
    - Sleep refreshes stamina and resets day, new vegitable prices.
    - go to farm use 
    - use tools to work on farm, spends stamina, and daytime. work till day ends (both shown as bars)
    - plant grow harvest sell
    - package fruits for better price and lasts longer but uses packaging material and stamina
    - throw garbage to compost (purchasable later, kept in warehouse)
    - sell fruits to the shopkeeper
    - fulfill orders for more money
    - More features to be added as needed
  
Development information:
    - Targets Android phone and Windows/linux 
    - Also playable hosted on the web (with proper saving working)
    - landscape 
    - Godot engine
    - player save data
    - export import save file
    - multiple save data
    - SVG graphics for most graphic elements 
    - use as much open source tools as possible
