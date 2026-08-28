import { DotaHero } from '../types/dota';

export const DOTA_HEROES: DotaHero[] = [
  // STRENGTH HEROES
  { id: 102, name: 'npc_dota_hero_abaddon', shortName: 'abaddon', displayName: 'Abaddon', primaryAttr: 'str', roles: ['Support', 'Carry', 'Durable'], legs: 2 },
  { id: 73, name: 'npc_dota_hero_alchemist', shortName: 'alchemist', displayName: 'Alchemist', primaryAttr: 'str', roles: ['Carry', 'Support', 'Durable', 'Disabler', 'Initiator', 'Nuker'], legs: 2 },
  { id: 2, name: 'npc_dota_hero_axe', shortName: 'axe', displayName: 'Axe', primaryAttr: 'str', roles: ['Initiator', 'Durable', 'Disabler', 'Carry'], legs: 2 },
  { id: 99, name: 'npc_dota_hero_bristleback', shortName: 'bristleback', displayName: 'Bristleback', primaryAttr: 'str', roles: ['Carry', 'Durable', 'Initiator', 'Nuker'], legs: 2 },
  { id: 96, name: 'npc_dota_hero_centaur', shortName: 'centaur', displayName: 'Centaur Warrunner', primaryAttr: 'str', roles: ['Durable', 'Initiator', 'Disabler', 'Nuker'], legs: 4 },
  { id: 81, name: 'npc_dota_hero_chaos_knight', shortName: 'chaos_knight', displayName: 'Chaos Knight', primaryAttr: 'str', roles: ['Carry', 'Disabler', 'Durable', 'Pusher'], legs: 2 },
  { id: 135, name: 'npc_dota_hero_dawnbreaker', shortName: 'dawnbreaker', displayName: 'Dawnbreaker', primaryAttr: 'str', roles: ['Carry', 'Durable'], legs: 2 },
  { id: 69, name: 'npc_dota_hero_doom_bringer', shortName: 'doom_bringer', displayName: 'Doom', primaryAttr: 'str', roles: ['Carry', 'Disabler', 'Initiator', 'Durable', 'Nuker'], legs: 2 },
  { id: 107, name: 'npc_dota_hero_earth_spirit', shortName: 'earth_spirit', displayName: 'Earth Spirit', primaryAttr: 'str', roles: ['Nuker', 'Escape', 'Disabler', 'Initiator', 'Durable'], legs: 2 },
  { id: 7, name: 'npc_dota_hero_earthshaker', shortName: 'earthshaker', displayName: 'Earthshaker', primaryAttr: 'str', roles: ['Support', 'Initiator', 'Disabler', 'Nuker'], legs: 2 },
  { id: 103, name: 'npc_dota_hero_elder_titan', shortName: 'elder_titan', displayName: 'Elder Titan', primaryAttr: 'str', roles: ['Initiator', 'Disabler', 'Nuker', 'Durable'], legs: 2 },
  { id: 29, name: 'npc_dota_hero_tidehunter', shortName: 'tidehunter', displayName: 'Tidehunter', primaryAttr: 'str', roles: ['Initiator', 'Durable', 'Disabler', 'Support', 'Nuker'], legs: 2 },
  { id: 49, name: 'npc_dota_hero_dragon_knight', shortName: 'dragon_knight', displayName: 'Dragon Knight', primaryAttr: 'str', roles: ['Carry', 'Pusher', 'Durable', 'Disabler', 'Initiator', 'Nuker'], legs: 2 },
  { id: 54, name: 'npc_dota_hero_life_stealer', shortName: 'life_stealer', displayName: 'Lifestealer', primaryAttr: 'str', roles: ['Carry', 'Durable', 'Escape', 'Disabler'], legs: 2 },
  { id: 59, name: 'npc_dota_hero_huskar', shortName: 'huskar', displayName: 'Huskar', primaryAttr: 'str', roles: ['Carry', 'Durable', 'Initiator'], legs: 2 },
  { id: 23, name: 'npc_dota_hero_kunkka', shortName: 'kunkka', displayName: 'Kunkka', primaryAttr: 'str', roles: ['Carry', 'Support', 'Disabler', 'Initiator', 'Durable', 'Nuker'], legs: 2 },
  { id: 104, name: 'npc_dota_hero_legion_commander', shortName: 'legion_commander', displayName: 'Legion Commander', primaryAttr: 'str', roles: ['Carry', 'Disabler', 'Initiator', 'Durable', 'Nuker'], legs: 2 },
  { id: 137, name: 'npc_dota_hero_primal_beast', shortName: 'primal_beast', displayName: 'Primal Beast', primaryAttr: 'str', roles: ['Initiator', 'Durable', 'Disabler'], legs: 2 },
  { id: 14, name: 'npc_dota_hero_pudge', shortName: 'pudge', displayName: 'Pudge', primaryAttr: 'str', roles: ['Disabler', 'Initiator', 'Durable', 'Nuker'], legs: 2 },
  { id: 16, name: 'npc_dota_hero_sand_king', shortName: 'sand_king', displayName: 'Sand King', primaryAttr: 'str', roles: ['Initiator', 'Disabler', 'Support', 'Nuker', 'Escape'], legs: 6 },
  { id: 18, name: 'npc_dota_hero_sven', shortName: 'sven', displayName: 'Sven', primaryAttr: 'str', roles: ['Carry', 'Disabler', 'Initiator', 'Durable', 'Nuker'], legs: 2 },
  { id: 19, name: 'npc_dota_hero_tiny', shortName: 'tiny', displayName: 'Tiny', primaryAttr: 'str', roles: ['Carry', 'Nuker', 'Pusher', 'Initiator', 'Durable', 'Disabler'], legs: 2 },
  { id: 83, name: 'npc_dota_hero_treant', shortName: 'treant', displayName: 'Treant Protector', primaryAttr: 'str', roles: ['Support', 'Initiator', 'Durable', 'Disabler', 'Escape'], legs: 2 },
  { id: 100, name: 'npc_dota_hero_tusk', shortName: 'tusk', displayName: 'Tusk', primaryAttr: 'str', roles: ['Initiator', 'Disabler', 'Nuker', 'Support'], legs: 2 },
  { id: 85, name: 'npc_dota_hero_undying', shortName: 'undying', displayName: 'Undying', primaryAttr: 'str', roles: ['Support', 'Durable', 'Disabler', 'Nuker'], legs: 2 },
  { id: 42, name: 'npc_dota_hero_skeleton_king', shortName: 'skeleton_king', displayName: 'Wraith King', primaryAttr: 'str', roles: ['Carry', 'Support', 'Durable', 'Disabler', 'Initiator'], legs: 2 },
  { id: 51, name: 'npc_dota_hero_rattletrap', shortName: 'rattletrap', displayName: 'Clockwerk', primaryAttr: 'str', roles: ['Initiator', 'Disabler', 'Durable', 'Nuker'], legs: 2 },
  { id: 60, name: 'npc_dota_hero_night_stalker', shortName: 'night_stalker', displayName: 'Night Stalker', primaryAttr: 'str', roles: ['Carry', 'Initiator', 'Durable', 'Disabler', 'Nuker'], legs: 2 },
  { id: 71, name: 'npc_dota_hero_spirit_breaker', shortName: 'spirit_breaker', displayName: 'Spirit Breaker', primaryAttr: 'str', roles: ['Initiator', 'Durable', 'Disabler', 'Escape'], legs: 2 },
  { id: 98, name: 'npc_dota_hero_shredder', shortName: 'shredder', displayName: 'Timbersaw', primaryAttr: 'str', roles: ['Nuker', 'Durable', 'Escape'], legs: 2 },
  { id: 128, name: 'npc_dota_hero_snapfire', shortName: 'snapfire', displayName: 'Snapfire', primaryAttr: 'str', roles: ['Support', 'Nuker', 'Disabler', 'Escape'], legs: 2 },
  { id: 131, name: 'npc_dota_hero_ringmaster', shortName: 'ringmaster', displayName: 'Ringmaster', primaryAttr: 'str', roles: ['Support', 'Disabler', 'Nuker', 'Escape'], legs: 2 },
  { id: 145, name: 'npc_dota_hero_kez', shortName: 'kez', displayName: 'Kez', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker'], legs: 2 },

  // AGILITY HEROES
  { id: 1, name: 'npc_dota_hero_antimage', shortName: 'antimage', displayName: 'Anti-Mage', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker'], legs: 2 },
  { id: 4, name: 'npc_dota_hero_bloodseeker', shortName: 'bloodseeker', displayName: 'Bloodseeker', primaryAttr: 'agi', roles: ['Carry', 'Disabler', 'Nuker', 'Initiator'], legs: 2 },
  { id: 62, name: 'npc_dota_hero_bounty_hunter', shortName: 'bounty_hunter', displayName: 'Bounty Hunter', primaryAttr: 'agi', roles: ['Escape', 'Nuker'], legs: 2 },
  { id: 61, name: 'npc_dota_hero_broodmother', shortName: 'broodmother', displayName: 'Broodmother', primaryAttr: 'agi', roles: ['Carry', 'Pusher', 'Escape', 'Nuker'], legs: 8 },
  { id: 6, name: 'npc_dota_hero_drow_ranger', shortName: 'drow_ranger', displayName: 'Drow Ranger', primaryAttr: 'agi', roles: ['Carry', 'Disabler', 'Pusher'], legs: 2 },
  { id: 106, name: 'npc_dota_hero_ember_spirit', shortName: 'ember_spirit', displayName: 'Ember Spirit', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker', 'Disabler', 'Initiator'], legs: 2 },
  { id: 58, name: 'npc_dota_hero_enchantress', shortName: 'enchantress', displayName: 'Enchantress', primaryAttr: 'agi', roles: ['Support', 'Pusher', 'Durable', 'Disabler'], legs: 4 },
  { id: 41, name: 'npc_dota_hero_faceless_void', shortName: 'faceless_void', displayName: 'Faceless Void', primaryAttr: 'agi', roles: ['Carry', 'Initiator', 'Disabler', 'Escape', 'Durable'], legs: 2 },
  { id: 72, name: 'npc_dota_hero_gyrocopter', shortName: 'gyrocopter', displayName: 'Gyrocopter', primaryAttr: 'agi', roles: ['Carry', 'Nuker', 'Disabler'], legs: 2 },
  { id: 123, name: 'npc_dota_hero_hoodwink', shortName: 'hoodwink', displayName: 'Hoodwink', primaryAttr: 'agi', roles: ['Support', 'Nuker', 'Escape', 'Disabler'], legs: 2 },
  { id: 8, name: 'npc_dota_hero_juggernaut', shortName: 'juggernaut', displayName: 'Juggernaut', primaryAttr: 'agi', roles: ['Carry', 'Pusher', 'Escape'], legs: 2 },
  { id: 80, name: 'npc_dota_hero_lone_druid', shortName: 'lone_druid', displayName: 'Lone Druid', primaryAttr: 'agi', roles: ['Carry', 'Pusher', 'Durable'], legs: 2 },
  { id: 48, name: 'npc_dota_hero_luna', shortName: 'luna', displayName: 'Luna', primaryAttr: 'agi', roles: ['Carry', 'Nuker', 'Pusher'], legs: 2 },
  { id: 94, name: 'npc_dota_hero_medusa', shortName: 'medusa', displayName: 'Medusa', primaryAttr: 'agi', roles: ['Carry', 'Disabler', 'Durable'], legs: 0 },
  { id: 82, name: 'npc_dota_hero_meepo', shortName: 'meepo', displayName: 'Meepo', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker', 'Disabler', 'Pusher'], legs: 2 },
  { id: 9, name: 'npc_dota_hero_mirana', shortName: 'mirana', displayName: 'Mirana', primaryAttr: 'agi', roles: ['Carry', 'Support', 'Escape', 'Nuker', 'Disabler'], legs: 2 },
  { id: 114, name: 'npc_dota_hero_monkey_king', shortName: 'monkey_king', displayName: 'Monkey King', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Disabler', 'Initiator'], legs: 2 },
  { id: 10, name: 'npc_dota_hero_morphling', shortName: 'morphling', displayName: 'Morphling', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker', 'Durable'], legs: 0 },
  { id: 89, name: 'npc_dota_hero_naga_siren', shortName: 'naga_siren', displayName: 'Naga Siren', primaryAttr: 'agi', roles: ['Carry', 'Support', 'Pusher', 'Disabler', 'Initiator', 'Escape'], legs: 0 },
  { id: 12, name: 'npc_dota_hero_phantom_lancer', shortName: 'phantom_lancer', displayName: 'Phantom Lancer', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Pusher', 'Nuker'], legs: 2 },
  { id: 44, name: 'npc_dota_hero_phantom_assassin', shortName: 'phantom_assassin', displayName: 'Phantom Assassin', primaryAttr: 'agi', roles: ['Carry', 'Escape'], legs: 2 },
  { id: 32, name: 'npc_dota_hero_riki', shortName: 'riki', displayName: 'Riki', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Disabler'], legs: 2 },
  { id: 15, name: 'npc_dota_hero_razor', shortName: 'razor', displayName: 'Razor', primaryAttr: 'agi', roles: ['Carry', 'Durable', 'Nuker', 'Pusher'], legs: 0 },
  { id: 46, name: 'npc_dota_hero_templar_assassin', shortName: 'templar_assassin', displayName: 'Templar Assassin', primaryAttr: 'agi', roles: ['Carry', 'Escape'], legs: 2 },
  { id: 109, name: 'npc_dota_hero_terrorblade', shortName: 'terrorblade', displayName: 'Terrorblade', primaryAttr: 'agi', roles: ['Carry', 'Pusher', 'Nuker'], legs: 2 },
  { id: 95, name: 'npc_dota_hero_troll_warlord', shortName: 'troll_warlord', displayName: 'Troll Warlord', primaryAttr: 'agi', roles: ['Carry', 'Pusher', 'Disabler', 'Durable'], legs: 2 },
  { id: 70, name: 'npc_dota_hero_ursa', shortName: 'ursa', displayName: 'Ursa', primaryAttr: 'agi', roles: ['Carry', 'Durable', 'Disabler'], legs: 2 },
  { id: 47, name: 'npc_dota_hero_viper', shortName: 'viper', displayName: 'Viper', primaryAttr: 'agi', roles: ['Carry', 'Durable', 'Initiator', 'Disabler'], legs: 2 },
  { id: 63, name: 'npc_dota_hero_weaver', shortName: 'weaver', displayName: 'Weaver', primaryAttr: 'agi', roles: ['Carry', 'Escape'], legs: 4 },
  { id: 93, name: 'npc_dota_hero_slark', shortName: 'slark', displayName: 'Slark', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Disabler', 'Nuker'], legs: 2 },
  { id: 28, name: 'npc_dota_hero_slardar', shortName: 'slardar', displayName: 'Slardar', primaryAttr: 'agi', roles: ['Carry', 'Durable', 'Initiator', 'Disabler', 'Escape'], legs: 0 },
  { id: 11, name: 'npc_dota_hero_nevermore', shortName: 'nevermore', displayName: 'Shadow Fiend', primaryAttr: 'agi', roles: ['Carry', 'Nuker'], legs: 0 },
  { id: 67, name: 'npc_dota_hero_spectre', shortName: 'spectre', displayName: 'Spectre', primaryAttr: 'agi', roles: ['Carry', 'Durable', 'Escape'], legs: 0 },
  { id: 20, name: 'npc_dota_hero_vengefulspirit', shortName: 'vengefulspirit', displayName: 'Vengeful Spirit', primaryAttr: 'agi', roles: ['Support', 'Initiator', 'Disabler', 'Nuker', 'Escape'], legs: 2 },
  { id: 40, name: 'npc_dota_hero_venomancer', shortName: 'venomancer', displayName: 'Venomancer', primaryAttr: 'agi', roles: ['Support', 'Nuker', 'Initiator', 'Pusher', 'Disabler'], legs: 0 },
  { id: 88, name: 'npc_dota_hero_nyx_assassin', shortName: 'nyx_assassin', displayName: 'Nyx Assassin', primaryAttr: 'all', roles: ['Disabler', 'Nuker', 'Initiator', 'Escape'], legs: 6 },

  // INTELLIGENCE HEROES
  { id: 13, name: 'npc_dota_hero_puck', shortName: 'puck', displayName: 'Puck', primaryAttr: 'int', roles: ['Initiator', 'Disabler', 'Escape', 'Nuker'], legs: 2 },
  { id: 43, name: 'npc_dota_hero_death_prophet', shortName: 'death_prophet', displayName: 'Death Prophet', primaryAttr: 'all', roles: ['Carry', 'Pusher', 'Nuker', 'Durable'], legs: 2 },
  { id: 68, name: 'npc_dota_hero_ancient_apparition', shortName: 'ancient_apparition', displayName: 'Ancient Apparition', primaryAttr: 'int', roles: ['Support', 'Disabler', 'Nuker'], legs: 0 },
  { id: 3, name: 'npc_dota_hero_bane', shortName: 'bane', displayName: 'Bane', primaryAttr: 'int', roles: ['Support', 'Disabler', 'Nuker', 'Durable'], legs: 4 },
  { id: 65, name: 'npc_dota_hero_batrider', shortName: 'batrider', displayName: 'Batrider', primaryAttr: 'int', roles: ['Initiator', 'Disabler', 'Escape'], legs: 2 },
  { id: 5, name: 'npc_dota_hero_crystal_maiden', shortName: 'crystal_maiden', displayName: 'Crystal Maiden', primaryAttr: 'int', roles: ['Support', 'Disabler', 'Nuker'], legs: 2 },
  { id: 87, name: 'npc_dota_hero_disruptor', shortName: 'disruptor', displayName: 'Disruptor', primaryAttr: 'int', roles: ['Support', 'Initiator', 'Disabler', 'Nuker'], legs: 2 },
  { id: 33, name: 'npc_dota_hero_enigma', shortName: 'enigma', displayName: 'Enigma', primaryAttr: 'int', roles: ['Disabler', 'Initiator', 'Pusher'], legs: 0 },
  { id: 121, name: 'npc_dota_hero_grimstroke', shortName: 'grimstroke', displayName: 'Grimstroke', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Disabler', 'Escape'], legs: 2 },
  { id: 74, name: 'npc_dota_hero_invoker', shortName: 'invoker', displayName: 'Invoker', primaryAttr: 'int', roles: ['Carry', 'Nuker', 'Disabler', 'Escape', 'Pusher'], legs: 2 },
  { id: 64, name: 'npc_dota_hero_jakiro', shortName: 'jakiro', displayName: 'Jakiro', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Pusher', 'Disabler'], legs: 2 },
  { id: 90, name: 'npc_dota_hero_keeper_of_the_light', shortName: 'keeper_of_the_light', displayName: 'Keeper of the Light', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Disabler'], legs: 2 },
  { id: 52, name: 'npc_dota_hero_leshrac', shortName: 'leshrac', displayName: 'Leshrac', primaryAttr: 'int', roles: ['Carry', 'Support', 'Nuker', 'Pusher', 'Disabler'], legs: 4 },
  { id: 31, name: 'npc_dota_hero_lich', shortName: 'lich', displayName: 'Lich', primaryAttr: 'int', roles: ['Support', 'Nuker'], legs: 2 },
  { id: 25, name: 'npc_dota_hero_lina', shortName: 'lina', displayName: 'Lina', primaryAttr: 'int', roles: ['Support', 'Carry', 'Nuker', 'Disabler'], legs: 2 },
  { id: 26, name: 'npc_dota_hero_lion', shortName: 'lion', displayName: 'Lion', primaryAttr: 'int', roles: ['Support', 'Disabler', 'Nuker', 'Initiator'], legs: 2 },
  { id: 138, name: 'npc_dota_hero_muerta', shortName: 'muerta', displayName: 'Muerta', primaryAttr: 'int', roles: ['Carry', 'Nuker', 'Disabler'], legs: 2 },
  { id: 53, name: 'npc_dota_hero_furion', shortName: 'furion', displayName: 'Nature\'s Prophet', primaryAttr: 'int', roles: ['Carry', 'Pusher', 'Escape', 'Nuker'], legs: 2 },
  { id: 36, name: 'npc_dota_hero_necrolyte', shortName: 'necrolyte', displayName: 'Necrophos', primaryAttr: 'int', roles: ['Carry', 'Nuker', 'Durable', 'Disabler'], legs: 2 },
  { id: 111, name: 'npc_dota_hero_oracle', shortName: 'oracle', displayName: 'Oracle', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Disabler', 'Escape'], legs: 2 },
  { id: 76, name: 'npc_dota_hero_obsidian_destroyer', shortName: 'obsidian_destroyer', displayName: 'Outworld Destroyer', primaryAttr: 'int', roles: ['Carry', 'Nuker', 'Disabler'], legs: 4 },
  { id: 45, name: 'npc_dota_hero_pugna', shortName: 'pugna', displayName: 'Pugna', primaryAttr: 'int', roles: ['Nuker', 'Pusher', 'Support'], legs: 2 },
  { id: 39, name: 'npc_dota_hero_queenofpain', shortName: 'queenofpain', displayName: 'Queen of Pain', primaryAttr: 'int', roles: ['Carry', 'Nuker', 'Escape'], legs: 2 },
  { id: 86, name: 'npc_dota_hero_rubick', shortName: 'rubick', displayName: 'Rubick', primaryAttr: 'int', roles: ['Support', 'Disabler', 'Nuker'], legs: 2 },
  { id: 27, name: 'npc_dota_hero_shadow_shaman', shortName: 'shadow_shaman', displayName: 'Shadow Shaman', primaryAttr: 'int', roles: ['Support', 'Pusher', 'Disabler', 'Nuker', 'Initiator'], legs: 2 },
  { id: 75, name: 'npc_dota_hero_silencer', shortName: 'silencer', displayName: 'Silencer', primaryAttr: 'int', roles: ['Carry', 'Support', 'Disabler', 'Initiator', 'Nuker'], legs: 2 },
  { id: 101, name: 'npc_dota_hero_skywrath_mage', shortName: 'skywrath_mage', displayName: 'Skywrath Mage', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Disabler'], legs: 2 },
  { id: 17, name: 'npc_dota_hero_storm_spirit', shortName: 'storm_spirit', displayName: 'Storm Spirit', primaryAttr: 'int', roles: ['Carry', 'Escape', 'Nuker', 'Initiator', 'Disabler'], legs: 2 },
  { id: 34, name: 'npc_dota_hero_tinker', shortName: 'tinker', displayName: 'Tinker', primaryAttr: 'int', roles: ['Carry', 'Nuker', 'Pusher'], legs: 2 },
  { id: 92, name: 'npc_dota_hero_visage', shortName: 'visage', displayName: 'Visage', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Durable', 'Disabler', 'Pusher'], legs: 2 },
  { id: 112, name: 'npc_dota_hero_winter_wyvern', shortName: 'winter_wyvern', displayName: 'Winter Wyvern', primaryAttr: 'int', roles: ['Support', 'Disabler', 'Nuker'], legs: 2 },
  { id: 30, name: 'npc_dota_hero_witch_doctor', shortName: 'witch_doctor', displayName: 'Witch Doctor', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Disabler'], legs: 2 },
  { id: 22, name: 'npc_dota_hero_zuus', shortName: 'zuus', displayName: 'Zeus', primaryAttr: 'int', roles: ['Nuker', 'Carry'], legs: 2 },
  { id: 119, name: 'npc_dota_hero_dark_willow', shortName: 'dark_willow', displayName: 'Dark Willow', primaryAttr: 'int', roles: ['Support', 'Nuker', 'Disabler', 'Escape'], legs: 2 },

  // UNIVERSAL / HYBRID HEROES (New attribute class in modern Dota 2)
  { id: 38, name: 'npc_dota_hero_beastmaster', shortName: 'beastmaster', displayName: 'Beastmaster', primaryAttr: 'all', roles: ['Initiator', 'Disabler', 'Durable', 'Nuker'], legs: 2 },
  { id: 78, name: 'npc_dota_hero_brewmaster', shortName: 'brewmaster', displayName: 'Brewmaster', primaryAttr: 'all', roles: ['Carry', 'Initiator', 'Durable', 'Disabler', 'Nuker'], legs: 2 },
  { id: 66, name: 'npc_dota_hero_chen', shortName: 'chen', displayName: 'Chen', primaryAttr: 'all', roles: ['Support', 'Pusher'], legs: 2 },
  { id: 55, name: 'npc_dota_hero_dark_seer', shortName: 'dark_seer', displayName: 'Dark Seer', primaryAttr: 'all', roles: ['Initiator', 'Escape', 'Disabler'], legs: 2 },
  { id: 37, name: 'npc_dota_hero_warlock', shortName: 'warlock', displayName: 'Warlock', primaryAttr: 'all', roles: ['Support', 'Initiator', 'Disabler'], legs: 2 },
  { id: 110, name: 'npc_dota_hero_phoenix', shortName: 'phoenix', displayName: 'Phoenix', primaryAttr: 'all', roles: ['Support', 'Nuker', 'Initiator', 'Escape', 'Disabler'], legs: 2 },
  { id: 84, name: 'npc_dota_hero_ogre_magi', shortName: 'ogre_magi', displayName: 'Ogre Magi', primaryAttr: 'str', roles: ['Support', 'Nuker', 'Disabler', 'Durable', 'Initiator'], legs: 2 },
  { id: 97, name: 'npc_dota_hero_magnataur', shortName: 'magnataur', displayName: 'Magnus', primaryAttr: 'all', roles: ['Initiator', 'Disabler', 'Nuker', 'Escape'], legs: 4 },
  { id: 126, name: 'npc_dota_hero_void_spirit', shortName: 'void_spirit', displayName: 'Void Spirit', primaryAttr: 'all', roles: ['Carry', 'Escape', 'Nuker', 'Disabler'], legs: 2 },
  { id: 120, name: 'npc_dota_hero_pangolier', shortName: 'pangolier', displayName: 'Pangolier', primaryAttr: 'all', roles: ['Carry', 'Nuker', 'Disabler', 'Durable', 'Escape', 'Initiator'], legs: 2 },
  { id: 129, name: 'npc_dota_hero_mars', shortName: 'mars', displayName: 'Mars', primaryAttr: 'str', roles: ['Initiator', 'Durable', 'Disabler', 'Carry'], legs: 2 },
  { id: 136, name: 'npc_dota_hero_marci', shortName: 'marci', displayName: 'Marci', primaryAttr: 'all', roles: ['Support', 'Carry', 'Initiator', 'Disabler', 'Escape'], legs: 2 },
  { id: 108, name: 'npc_dota_hero_underlord', shortName: 'underlord', displayName: 'Underlord', primaryAttr: 'str', roles: ['Support', 'Nuker', 'Durable', 'Disabler', 'Escape'], legs: 2 },
  { id: 105, name: 'npc_dota_hero_techies', shortName: 'techies', displayName: 'Techies', primaryAttr: 'all', roles: ['Nuker', 'Disabler'], legs: 2 },
  { id: 113, name: 'npc_dota_hero_arc_warden', shortName: 'arc_warden', displayName: 'Arc Warden', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker'], legs: 2 },
  { id: 21, name: 'npc_dota_hero_windrunner', shortName: 'windrunner', displayName: 'Windranger', primaryAttr: 'all', roles: ['Carry', 'Support', 'Disabler', 'Escape', 'Nuker'], legs: 2 },
  { id: 91, name: 'npc_dota_hero_wisp', shortName: 'wisp', displayName: 'Io', primaryAttr: 'all', roles: ['Support', 'Escape', 'Nuker'], legs: 0 },
  { id: 50, name: 'npc_dota_hero_dazzle', shortName: 'dazzle', displayName: 'Dazzle', primaryAttr: 'all', roles: ['Support', 'Nuker', 'Disabler'], legs: 2 },
  { id: 57, name: 'npc_dota_hero_omniknight', shortName: 'omniknight', displayName: 'Omniknight', primaryAttr: 'str', roles: ['Support', 'Durable', 'Nuker'], legs: 2 },
  { id: 35, name: 'npc_dota_hero_sniper', shortName: 'sniper', displayName: 'Sniper', primaryAttr: 'agi', roles: ['Carry', 'Nuker'], legs: 2 },
  { id: 77, name: 'npc_dota_hero_lycan', shortName: 'lycan', displayName: 'Lycan', primaryAttr: 'all', roles: ['Carry', 'Pusher', 'Durable', 'Escape'], legs: 2 },
  { id: 79, name: 'npc_dota_hero_shadow_demon', shortName: 'shadow_demon', displayName: 'Shadow Demon', primaryAttr: 'all', roles: ['Support', 'Disabler', 'Initiator', 'Nuker'], legs: 2 },
  { id: 56, name: 'npc_dota_hero_clinkz', shortName: 'clinkz', displayName: 'Clinkz', primaryAttr: 'agi', roles: ['Carry', 'Escape', 'Nuker'], legs: 2 }
];

// Helper maps for O(1) lookups
export const HEROES_BY_ID = new Map<number, DotaHero>();
export const HEROES_BY_NAME = new Map<string, DotaHero>();

DOTA_HEROES.forEach(hero => {
  HEROES_BY_ID.set(hero.id, hero);
  HEROES_BY_NAME.set(hero.name, hero);
  HEROES_BY_NAME.set(hero.shortName, hero);
});

// Official Dota 2 CDN avatar image URLs with multi-CDN fallback
export function getHeroImageUrls(shortName: string): string[] {
  return [
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`,
    `https://cdn.dota2.com/apps/dota2/images/heroes/${shortName}_full.png`,
    `https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/${shortName}.png`,
    `https://raw.githubusercontent.com/kronuspro/dota2-api/master/images/heroes/${shortName}_vert.jpg`,
    `https://api.opendota.com/apps/dota2/images/dota_react/heroes/${shortName}.png`
  ];
}

export function getHeroImageUrl(shortName: string): string {
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`;
}

export function getHeroSmallImageUrl(shortName: string): string {
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/${shortName}.png`;
}

// Attribute color helpers
export const ATTR_COLORS: Record<string, { name: string; bg: string; text: string; border: string; glow: string; icon: string }> = {
  str: { name: 'Strength', bg: '#ef4444', text: '#fca5a5', border: '#b91c1c', glow: 'rgba(239, 68, 68, 0.4)', icon: '⚔️' },
  agi: { name: 'Agility', bg: '#22c55e', text: '#86efac', border: '#15803d', glow: 'rgba(34, 197, 94, 0.4)', icon: '🏹' },
  int: { name: 'Intelligence', bg: '#06b6d4', text: '#67e8f9', border: '#0e7490', glow: 'rgba(6, 182, 212, 0.4)', icon: '🧙' },
  all: { name: 'Universal', bg: '#a855f7', text: '#d8b4fe', border: '#7e22ce', glow: 'rgba(168, 85, 247, 0.4)', icon: '💎' },
};

// Comprehensive unicode symbols for Dota 2 grid decoration
export const SYMBOL_CATEGORIES = {
  sticks: {
    name: 'Палочки & Линии (Sticks & Lines)',
    symbols: [
      { char: '─', name: 'Горизонтальная одинарная' },
      { char: '│', name: 'Вертикальная одинарная' },
      { char: '━', name: 'Горизонтальная жирная' },
      { char: '┃', name: 'Вертикальная жирная' },
      { char: '═', name: 'Горизонтальная двойная' },
      { char: '║', name: 'Вертикальная двойная' },
      { char: '┌', name: 'Угол верх-лево' },
      { char: '┐', name: 'Угол верх-право' },
      { char: '└', name: 'Угол низ-лево' },
      { char: '┘', name: 'Угол низ-право' },
      { char: '╔', name: 'Двойной угол верх-лево' },
      { char: '╗', name: 'Двойной угол верх-право' },
      { char: '╚', name: 'Двойной угол низ-лево' },
      { char: '╝', name: 'Двойной угол низ-право' },
      { char: '┏', name: 'Жирный угол верх-лево' },
      { char: '┓', name: 'Жирный угол верх-право' },
      { char: '┗', name: 'Жирный угол низ-лево' },
      { char: '┛', name: 'Жирный угол низ-право' },
      { char: '├', name: 'Тройник левый' },
      { char: '┤', name: 'Тройник правый' },
      { char: '┬', name: 'Тройник верхний' },
      { char: '┴', name: 'Тройник нижний' },
      { char: '┼', name: 'Крестовина' },
      { char: '╬', name: 'Двойной крест' },
      { char: '╱', name: 'Диагональ вправо' },
      { char: '╲', name: 'Диагональ влево' },
      { char: '╳', name: 'Диагональный крест' },
      { char: '|', name: 'Прямая черта' },
      { char: '/', name: 'Слэш' },
      { char: '\\', name: 'Бэкслэш' },
      { char: '-', name: 'Дефис' },
      { char: '_', name: 'Подчёркивание' }
    ]
  },
  stars: {
    name: 'Звёздочки & Сияние (Stars & Glow)',
    symbols: [
      { char: '★', name: 'Чёрная звезда' },
      { char: '☆', name: 'Белая звезда' },
      { char: '✦', name: 'Четырёхконечная звезда' },
      { char: '✧', name: 'Белая искра' },
      { char: '✪', name: 'Звезда в круге' },
      { char: '✫', name: 'Пятиконечная с контуром' },
      { char: '✬', name: 'Толстая звезда' },
      { char: '✭', name: 'Наклонная звезда' },
      { char: '✯', name: 'Игольчатая звезда' },
      { char: '✰', name: 'Фигурная звезда' },
      { char: '✶', name: 'Шестиконечная искра' },
      { char: '✵', name: 'Восьмиконечная звезда' },
      { char: '✹', name: 'Взрыв сияния' },
      { char: '⭐', name: 'Золотая звезда' },
      { char: '🌟', name: 'Сияющая звезда' },
      { char: '✨', name: 'Искры' }
    ]
  },
  blocks: {
    name: 'Блоки & Геометрия (Blocks & Shapes)',
    symbols: [
      { char: '■', name: 'Чёрный квадрат' },
      { char: '□', name: 'Белый квадрат' },
      { char: '▲', name: 'Треугольник вверх' },
      { char: '▼', name: 'Треугольник вниз' },
      { char: '◄', name: 'Треугольник влево' },
      { char: '►', name: 'Треугольник вправо' },
      { char: '◆', name: 'Чёрный ромб' },
      { char: '◇', name: 'Белый ромб' },
      { char: '●', name: 'Чёрный круг' },
      { char: '○', name: 'Белый круг' },
      { char: '◈', name: 'Ромб с точкой' },
      { char: '▣', name: 'Квадрат с точкой' },
      { char: '█', name: 'Полный блок' },
      { char: '▀', name: 'Верхняя половина' },
      { char: '▄', name: 'Нижняя половина' },
      { char: '▌', name: 'Левая половина' },
      { char: '▐', name: 'Правая половина' },
      { char: '░', name: 'Светлая штриховка' },
      { char: '▒', name: 'Средняя штриховка' },
      { char: '▓', name: 'Тёмная штриховка' }
    ]
  },
  gaming: {
    name: 'Dota 2 & Турнирные (Combat & Gaming)',
    symbols: [
      { char: '⚔️', name: 'Мечи / Carry' },
      { char: '🛡️', name: 'Щит / Tank' },
      { char: '👑', name: 'Корона / Core' },
      { char: '⚡', name: 'Молния / Burst' },
      { char: '💀', name: 'Череп / Deadly' },
      { char: '🔥', name: 'Огонь / Aggressive' },
      { char: '❄️', name: 'Лёд / Control' },
      { char: '🎯', name: 'Мишень / Focus' },
      { char: '🚫', name: 'Запрет / Ban' },
      { char: '💎', name: 'Алмаз / Universal' },
      { char: '⚜️', name: 'Геральдическая лилия' },
      { char: '🏆', name: 'Кубок / S-Tier' },
      { char: '🥇', name: 'Золото / 1st Pick' },
      { char: '🥈', name: 'Серебро / 2nd Pick' },
      { char: '🥉', name: 'Бронза / 3rd Pick' },
      { char: '👁️', name: 'Вард / Vision' }
    ]
  },
  brackets: {
    name: 'Боковые Колонны & Скобки () { } (Aesthetic Columns)',
    symbols: [
      { char: ')()(', name: 'Двойная волна скобок' },
      { char: '}{}{', name: 'Змейка фигурных скобок' },
      { char: ')(', name: 'Обратная скобка' },
      { char: '}{', name: 'Фигурная змейка' },
      { char: '⟨⟩', name: 'Угловые скобки' },
      { char: '【】', name: 'Японские массивные скобки' },
      { char: '〖〗', name: 'Белые японские скобки' },
      { char: '〔〕', name: 'Черепашьи скобки' },
      { char: '「」', name: 'Угловые кавычки' },
      { char: '『』', name: 'Двойные угловые кавычки' },
      { char: '≪≫', name: 'Двойные углы' },
      { char: '‹›', name: 'Одинарные углы' },
      { char: '||', name: 'Двойная стойка' },
      { char: '││', name: 'Двойная линия' },
      { char: '║║', name: 'Двойная колонна' }
    ]
  },
  cute_aesthetic: {
    name: 'Аниме & Эстетика (Cute / Anime / Japanese)',
    symbols: [
      { char: '♡', name: 'Белое сердце' },
      { char: '♥', name: 'Чёрное сердце' },
      { char: 'ღ', name: 'Вензель сердца' },
      { char: 'ʚɞ', name: 'Крылышки бабочки' },
      { char: '✿', name: 'Цветок сакуры' },
      { char: '❀', name: 'Цветок с контуром' },
      { char: '✧', name: 'Аниме искра' },
      { char: '｡.:*☆', name: 'Мерцание' },
      { char: '♪', name: 'Нота' },
      { char: '♫', name: 'Две ноты' },
      { char: '•°', name: 'Пузырьки' }
    ]
  }
};

// Ready-to-use ASCII / Symbol templates for Dota 2 in-game categories
export const DOTA_ASCII_PRESETS = [
  {
    id: 'column_brackets_wave',
    name: 'Колонна )()( (Anime Bracket Column)',
    preview: ')()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(',
    text: ')()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(',
    type: 'column',
    width: 60,
    height: 480
  },
  {
    id: 'column_serpent_curly',
    name: 'Колонна }{}{ (Curly Serpent Column)',
    preview: '}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{',
    text: '}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{\n}{}{',
    type: 'column',
    width: 60,
    height: 480
  },
  {
    id: 'pos_kerry_header',
    name: 'Категория <KERRY | POS 1>',
    preview: '<KERRY | POS 1>',
    text: '<KERRY | POS 1>',
    type: 'role',
    width: 320,
    height: 36
  },
  {
    id: 'pos_main_header',
    name: 'Категория []MAIN[]',
    preview: '[]MAIN[]',
    text: '[]MAIN[]',
    type: 'role',
    width: 200,
    height: 36
  },
  {
    id: 'pos_hardline_header',
    name: 'Категория <HARD LINE | POS 3>',
    preview: '<HARD LINE | POS 3>',
    text: '<HARD LINE | POS 3>',
    type: 'role',
    width: 340,
    height: 36
  },
  {
    id: 'pos_mid_header',
    name: 'Категория <MID | POS 2>',
    preview: '<MID | POS 2>',
    text: '<MID | POS 2>',
    type: 'role',
    width: 280,
    height: 36
  },
  {
    id: 'pos_support_header',
    name: 'Категория <SUPPORT | POS 4 | POS 5>',
    preview: '<SUPPORT | POS 4 | POS 5>',
    text: '<SUPPORT | POS 4 | POS 5>',
    type: 'role',
    width: 400,
    height: 36
  },
  {
    id: 'anime_heart_banner',
    name: 'Сердечный баннер - - - ♡ - - -',
    preview: '─── ｡.:*♡*:.｡ ───',
    text: '── ─ ─ ─ ─ ─ ─ ─ ♡ ─ ─ ─ ─ ─ ─ ─ ──',
    type: 'anime',
    width: 450,
    height: 30
  },
  {
    id: 'anime_japanese_quote',
    name: 'Японский текст (Aesthetic Lyrics)',
    preview: 'うれしそうな音\n優しい音\nそれは今カムバックです\n世界で最も幸せなサポート',
    text: 'うれしそうな音\n優しい音\nそれは今カムバックです\n世界で最も幸せなサポート\n任意のコストでチームメイトを保存\n私たちはシールです\n > ^ - - ^ <',
    type: 'anime',
    width: 380,
    height: 180
  },
  {
    id: 'anime_carry_quote',
    name: 'Кавайный текст (My Carry / Team)',
    preview: 'マイキャリー\n最強と賢い\n世界で最高のチームメイト',
    text: 'マイキャリー\nキリルメガミポ\nキリルトリプルキル\n最強と賢い\n世界で最高のチームメイト',
    type: 'anime',
    width: 320,
    height: 140
  },
  {
    id: 'box_double',
    name: 'Двойная рамка (Double Box)',
    preview: '╔══════════════╗\n║  CATEGORY    ║\n╚══════════════╝',
    text: '╔══════════════════════════╗',
    type: 'frame',
    width: 480,
    height: 48
  },
  {
    id: 'box_single',
    name: 'Одинарная рамка (Single Box)',
    preview: '┌──────────────┐\n│  CATEGORY    │\n└──────────────┘',
    text: '┌──────────────────────────┐',
    type: 'frame',
    width: 480,
    height: 48
  },
  {
    id: 'box_heavy',
    name: 'Жирная рамка (Heavy Box)',
    preview: '┏━━━━━━━━━━━━━━┓\n┃  CATEGORY    ┃\n┗━━━━━━━━━━━━━━┛',
    text: '┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓',
    type: 'frame',
    width: 480,
    height: 48
  },
  {
    id: 'stars_banner',
    name: 'Звёздный баннер (Star Banner)',
    preview: '★ ★ ★ ★ ★ ★ ★ ★ ★ ★',
    text: '★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★',
    type: 'stars',
    width: 420,
    height: 36
  },
  {
    id: 'line_horizontal',
    name: 'Горизонтальная линия (Line)',
    preview: '────────────────────────────',
    text: '────────────────────────────────────────',
    type: 'line',
    width: 500,
    height: 24
  },
  {
    id: 'line_double',
    name: 'Двойная линия (Double Line)',
    preview: '════════════════════════════',
    text: '════════════════════════════════════════',
    type: 'line',
    width: 500,
    height: 24
  },
  {
    id: 'line_dashed',
    name: 'Пунктирная черта (Dashed)',
    preview: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',
    text: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',
    type: 'line',
    width: 450,
    height: 24
  },
  {
    id: 'badge_brackets',
    name: 'Скобки категории [ NAME ]',
    preview: '[ ★ PRIORITY PICKS ★ ]',
    text: '[ ★ PRIORITY PICKS ★ ]',
    type: 'badge',
    width: 320,
    height: 36
  },
  {
    id: 'badge_swords',
    name: 'Боевая плашка ⚔ TIER 1 ⚔',
    preview: '⚔ ── TIER 1 HEROES ── ⚔',
    text: '⚔ ── TIER 1 HEROES ── ⚔',
    type: 'badge',
    width: 380,
    height: 36
  },
  {
    id: 'blocks_row',
    name: 'Ряд блоков ■ ■ ■ ■ ■',
    preview: '■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■',
    text: '■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■',
    type: 'blocks',
    width: 400,
    height: 30
  }
];

// Flat list of all icons for legacy compatibility
export const ICON_LIBRARY = [
  ...SYMBOL_CATEGORIES.gaming.symbols.map(s => ({ char: s.char, name: s.name, category: 'Gaming' })),
  ...SYMBOL_CATEGORIES.stars.symbols.map(s => ({ char: s.char, name: s.name, category: 'Stars' })),
  ...SYMBOL_CATEGORIES.sticks.symbols.slice(0, 10).map(s => ({ char: s.char, name: s.name, category: 'Sticks' })),
];

export const FONT_OPTIONS = [
  { label: 'Cinzel (Dota Aesthetic)', value: 'Cinzel, Georgia, serif' },
  { label: 'Trajan / Serif', value: 'Trajan Pro, Georgia, Times, serif' },
  { label: 'Cinematic Sans', value: 'Inter, system-ui, -apple-system, sans-serif' },
  { label: 'Impact Display', value: 'Impact, Haettenschweiler, sans-serif' },
  { label: 'Monospace Code', value: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
];
