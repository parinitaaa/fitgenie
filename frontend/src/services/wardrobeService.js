const STORAGE_KEY = 'wardrobe_items';

const wardrobeService = {
  // Save a new wardrobe item
  saveItem: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const items = wardrobeService.getItems();
          
          const newItem = {
            id: crypto.randomUUID(),
            image: e.target.result, // base64 encoded image
            createdAt: new Date().toISOString(),
          };
          
          items.push(newItem);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          
          resolve(newItem);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  },

  // Get all wardrobe items
  getItems: () => {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Failed to get items:', error);
      return [];
    }
  },

  // Get a single item by id
  getItemById: (id) => {
    const items = wardrobeService.getItems();
    return items.find(item => item.id === id);
  },
};

export default wardrobeService;
