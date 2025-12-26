export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  coverImage: string;
  category?: string;
  publisher_name?: string; 
  Publisher_id?: string; 
}