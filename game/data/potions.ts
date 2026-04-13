export interface PotionDef {
  id: string;
  name: string;
  description: string;
  price: number;
  healAmount: number;
  color: string;
}

export const POTIONS: PotionDef[] = [
  {
    id: 'health_small',
    name: 'Minor Health Potion',
    description: 'Restore 30 HP',
    price: 20,
    healAmount: 30,
    color: '#ff6b6b',
  },
  {
    id: 'health_medium',
    name: 'Health Potion',
    description: 'Restore 60 HP',
    price: 45,
    healAmount: 60,
    color: '#ff5252',
  },
  {
    id: 'health_large',
    name: 'Major Health Potion',
    description: 'Restore 100 HP',
    price: 80,
    healAmount: 100,
    color: '#ff1744',
  },
];

export function getPotion(id: string): PotionDef | undefined {
  return POTIONS.find(p => p.id === id);
}
