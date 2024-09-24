import { writeFile, mkdir } from 'fs/promises'

const trims = [
  'sentry',
  'vex',
  'wild',
  'coast',
  'dune',
  'wayfinder',
  'raiser',
  'shaper',
  'host',
  'ward',
  'silence',
  'tide',
  'snout',
  'rib',
  'eye',
  'spire',
  'flow',
  'bolt'
]

const tools = [
  'netherite_axe',
  'diamond_axe',
  'golden_axe',
  'iron_axe',
  'stone_axe',
  'wooden_axe',
  'netherite_pickaxe',
  'diamond_pickaxe',
  'golden_pickaxe',
  'iron_pickaxe',
  'stone_pickaxe',
  'wooden_pickaxe',
  'netherite_shovel',
  'diamond_shovel',
  'golden_shovel',
  'iron_shovel',
  'stone_shovel',
  'wooden_shovel',
  'netherite_hoe',
  'diamond_hoe',
  'golden_hoe',
  'iron_hoe',
  'stone_hoe',
  'wooden_hoe',
  'netherite_sword',
  'diamond_sword',
  'golden_sword',
  'iron_sword',
  'stone_sword',
  'wooden_sword',
  'bow',
  'crossbow',
  'mace',
  'trident'
]

const materials = [
  'quartz',
  'iron',
  'netherite',
  'redstone',
  'copper',
  'gold',
  'emerald',
  'diamond',
  'lapis',
  'amethyst'
]

function compareMaterial(material1: string, material2: string) {
  if (material1.startsWith('gold') && material2.startsWith('gold')) return true
  return material1 === material2
}

async function writeItemRecipes() {
  const promises: Promise<void>[] = []

  await mkdir(`./generator/output/assets/tool_trim/recipe`, { recursive: true })
  
  for (const tool of tools) {
    let [toolMaterial, toolName] = tool.split('_')

    if (!toolName) {
      toolName = toolMaterial
      toolMaterial = ''
    }
    
    let counter = 1

    for (const material of materials) {
      for (const trim of trims) {

        const recipeFile = compareMaterial(material, toolMaterial)
          ? `./generator/output/assets/tool_trim/recipe/${tool}_smithing_from_${trim}_and_${material}_darker.json`
          : `./generator/output/assets/tool_trim/recipe/${tool}_smithing_from_${trim}_and_${material}.json`
        const recipeContents = {
          type: 'minecraft:smithing_transform',
          template: {
            item: `minecraft:${trim}_armor_trim_smithing_template`
          },
          base: {
            item: `minecraft:${tool}`
          },
          addition: {
            item: `minecraft:${material}`
          },
          result: {
            id: `minecraft:${tool}`,
            components: {
              custom_model_data: counter++,
              'minecraft:trim': {
                material: `minecraft:${material}`,
                pattern: `minecraft:${trim}`
              }
            }
          }
        }

        promises.push(writeFile(recipeFile, JSON.stringify(recipeContents, null, 2)))
      }
    }
  }

  return Promise.all(promises)
}

writeItemRecipes()
