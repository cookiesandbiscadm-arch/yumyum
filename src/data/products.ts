import { Product } from '../context/CartContext';

export const products: Product[] = [
  {
    id: '1',
    name: 'Chocolate Chip Cookie',
    price: 2.99,
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'chocolate',
    description: 'Delicious chocolate chip cookies made with love and the finest chocolate chips!',
    nutrition: { calories: 150, sugar: 12, protein: 2 }
  },
  {
    id: '2',
    name: 'Strawberry Dreams',
    price: 3.49,
    image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'fruity',
    description: 'Sweet strawberry-flavored biscuits that taste like summer!',
    nutrition: { calories: 140, sugar: 15, protein: 1 }
  },
  {
    id: '3',
    name: 'Vanilla Cloud',
    price: 2.79,
    image: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'creamy',
    description: 'Light and fluffy vanilla biscuits that melt in your mouth!',
    nutrition: { calories: 130, sugar: 10, protein: 2 }
  },
  {
    id: '4',
    name: 'Rainbow Sprinkles',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'chocolate',
    description: 'Colorful biscuits covered in rainbow sprinkles for extra fun!',
    nutrition: { calories: 160, sugar: 18, protein: 2 }
  },
  {
    id: '5',
    name: 'Orange Sunshine',
    price: 3.29,
    image: 'https://images.pexels.com/photos/1998635/pexels-photo-1998635.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'fruity',
    description: 'Bright orange-flavored biscuits that bring sunshine to your day!',
    nutrition: { calories: 145, sugar: 14, protein: 1 }
  },
  {
    id: '6',
    name: 'Cream Sandwich',
    price: 4.49,
    image: 'https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'creamy',
    description: 'Two soft biscuits with creamy filling in between!',
    nutrition: { calories: 180, sugar: 16, protein: 3 }
  }
];

export const categories = [
  { id: 'all', name: 'All Treats', emoji: '🍪' },
  { id: 'chocolate', name: 'Chocolate', emoji: '🍫' },
  { id: 'fruity', name: 'Fruity', emoji: '🍓' },
  { id: 'creamy', name: 'Creamy', emoji: '🥛' }
];