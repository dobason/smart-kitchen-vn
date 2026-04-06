import { IngredientItem, IngredientGroup } from "@/types/ingredient";

export const INGREDIENTS: IngredientItem[] = [
    { emoji: '🍕', name: 'bột bánh pizza', qty: '1 cái', bg: '#F5E6D3' },
    { emoji: '🧀', name: 'phô mai bào sợi', qty: '200 g', bg: '#D6EAF8' },
    { emoji: '🍅', name: 'sốt cà chua', qty: '100 ml', bg: '#FADBD8' },
    { emoji: '🫑', name: '1/2 quả ớt chuông thái nhỏ', qty: '...', bg: '#FEF9E7' },
  ];

export const INITIAL_GROUPS: IngredientGroup[] = [
  {
    id: 'g1',
    label: 'Nguyên liệu chính',
    items: [
      { id: 'i1', qty: '200', unit: 'g', name: 'mì sợi' },
      { id: 'i2', qty: '150', unit: 'g', name: 'thịt heo thái mỏng' },
      { id: 'i3', qty: '0,5', unit: 'củ', name: 'hành tây thái lát' },
      { id: 'i4', qty: '3', unit: 'tép', name: 'tỏi băm nhỏ' },
    ],
  },
  {
    id: 'g2',
    label: 'Nước dùng',
    items: [
      { id: 'i5', qty: '800', unit: 'ml', name: 'nước dùng gà' },
      { id: 'i6', qty: '2', unit: 'muỗng c...', name: 'nước tương' },
      { id: 'i7', qty: '1', unit: 'muỗng c...', name: 'nước mắm' },
      { id: 'i8', qty: '1', unit: 'muỗng c...', name: 'sa tế ớt' },
    ],
  },
  {
    id: 'g3',
    label: 'Gia vị khác',
    items: [
      { id: 'i9', qty: '0,5', unit: 'muỗng c...', name: 'muối' },
      { id: 'i10', qty: '1', unit: 'muỗng c...', name: 'đường' },
      { id: 'i11', qty: '0,5', unit: 'muỗng c...', name: 'tiêu đen nghiền' },
      { id: 'i12', qty: '1', unit: 'muỗng c...', name: 'dầu ăn' },
    ],
  },
  {
    id: 'g4',
    label: 'Ăn kèm',
    items: [
      { id: 'i13', qty: '1', unit: 'quả', name: 'chanh cắt miếng' },
      { id: 'i14', qty: '2', unit: 'muỗng c...', name: 'hành phi' },
    ],
  },
];