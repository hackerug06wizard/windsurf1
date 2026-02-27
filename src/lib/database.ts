// Database utility functions
// In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)

export interface DatabaseItem {
  id: string;
  createdAt: string;
}

export class DatabaseService<T extends DatabaseItem> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // Get all items
  getAll(): T[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from ${this.storageKey}:`, error);
      return [];
    }
  }

  // Save all items
  saveAll(items: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving to ${this.storageKey}:`, error);
    }
  }

  // Add new item
  add(item: Omit<T, 'id' | 'createdAt'>): T {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    } as T;

    const items = this.getAll();
    items.push(newItem);
    this.saveAll(items);
    
    return newItem;
  }

  // Update item
  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    
    return items[index];
  }

  // Delete item
  delete(id: string): boolean {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    items.splice(index, 1);
    this.saveAll(items);
    
    return true;
  }

  // Find item by ID
  findById(id: string): T | null {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  // Clear all items
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }
}

// Create database service instances
export const productsDb = new DatabaseService('products');
export const usersDb = new DatabaseService('users');
export const ordersDb = new DatabaseService('orders');
