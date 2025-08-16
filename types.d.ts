interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  category: Category;
}

interface Category {
  id: number;
  name: string;
}