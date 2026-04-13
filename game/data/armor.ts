export interface ArmorDef {
  id: string;
  name: string;
  description: string;
  price: number;
  maxHealthBoost: number;
  damageReduction: number;
  color: string;
}

export const ARMOR: ArmorDef[] = [
  {
    id: 'leather',
    name: 'Leather Vest',
    description: 'Basic protection',
    price: 50,
    maxHealthBoost: 20,
    damageReduction: 0.05,
    color: '#8d6e63',
  },
  {
    id: 'chain',
    name: 'Chain Mail',
    description: 'Solid defense',
    price: 120,
    maxHealthBoost: 35,
    damageReduction: 0.12,
    color: '#757575',
  },
  {
    id: 'plate',
    name: 'Plate Armor',
    description: 'Heavy protection',
    price: 200,
    maxHealthBoost: 50,
    damageReduction: 0.18,
    color: '#c0c0c0',
  },
  {
    id: 'mithril',
    name: 'Mithril Armor',
    description: 'Superior defense',
    price: 350,
    maxHealthBoost: 70,
    damageReduction: 0.25,
    color: '#b3e5fc',
  },
];

export function getArmor(id: string): ArmorDef | undefined {
  return ARMOR.find(a => a.id === id);
}
