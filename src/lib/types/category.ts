import type { Database } from './db';

export type Category = Database['public']['Tables']['categories']['Row'];

export type Product = Database['public']['Tables']['listings']['Row'];