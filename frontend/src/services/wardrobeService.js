// Wardrobe Service - Manages wardrobe items and analysis data
const STORAGE_KEY = 'fitgenie_wardrobe';

/**
 * Get all wardrobe items from localStorage
 * @returns {Object} - Wardrobe data object
 */
export function getWardrobe() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { items: [], metadata: {} };
  } catch (error) {
    console.error('Error reading wardrobe:', error);
    return { items: [], metadata: {} };
  }
}

/**
 * Save wardrobe data to localStorage
 * @param {Object} wardrobeData - Wardrobe data to save
 */
function saveWardrobe(wardrobeData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wardrobeData));
  } catch (error) {
    console.error('Error saving wardrobe:', error);
  }
}

/**
 * Add or update clothing analysis
 * @param {string} itemId - Unique identifier for the item
 * @param {Object} analysisData - Dynamic analysis data from backend
 * @returns {Object} - Updated wardrobe data
 */
export function saveClothingAnalysis(itemId, analysisData) {
  const wardrobe = getWardrobe();
  
  // Ensure metadata object exists
  if (!wardrobe.metadata) {
    wardrobe.metadata = {};
  }
  
  // Store analysis with timestamp
  wardrobe.metadata[itemId] = {
    type: 'clothing',
    data: analysisData,
    timestamp: new Date().toISOString(),
  };
  
  // Add to items array if not already present
  if (!wardrobe.items.includes(itemId)) {
    wardrobe.items.push(itemId);
  }
  
  saveWardrobe(wardrobe);
  return wardrobe;
}

/**
 * Add or update skin tone analysis
 * @param {Object} analysisData - Dynamic analysis data from backend
 * @returns {Object} - Updated wardrobe data
 */
export function saveSkinAnalysis(analysisData) {
  const wardrobe = getWardrobe();
  
  // Ensure metadata object exists
  if (!wardrobe.metadata) {
    wardrobe.metadata = {};
  }
  
  // Store skin analysis separately
  wardrobe.metadata.skinTone = {
    type: 'skin',
    data: analysisData,
    timestamp: new Date().toISOString(),
  };
  
  saveWardrobe(wardrobe);
  return wardrobe;
}

/**
 * Get specific item metadata
 * @param {string} itemId - Item identifier
 * @returns {Object|null} - Item metadata or null
 */
export function getItemMetadata(itemId) {
  const wardrobe = getWardrobe();
  return wardrobe.metadata?.[itemId] || null;
}

/**
 * Get skin tone analysis
 * @returns {Object|null} - Skin tone data or null
 */
export function getSkinAnalysis() {
  const wardrobe = getWardrobe();
  return wardrobe.metadata?.skinTone || null;
}

/**
 * Get all items with their metadata
 * @returns {Array} - Array of items with metadata
 */
export function getAllItems() {
  const wardrobe = getWardrobe();
  return wardrobe.items.map(itemId => ({
    id: itemId,
    metadata: wardrobe.metadata?.[itemId] || null,
  }));
}

/**
 * Remove an item from wardrobe
 * @param {string} itemId - Item identifier
 * @returns {Object} - Updated wardrobe data
 */
export function removeItem(itemId) {
  const wardrobe = getWardrobe();
  
  // Remove from items array
  wardrobe.items = wardrobe.items.filter(id => id !== itemId);
  
  // Remove metadata
  if (wardrobe.metadata?.[itemId]) {
    delete wardrobe.metadata[itemId];
  }
  
  saveWardrobe(wardrobe);
  return wardrobe;
}

/**
 * Clear all wardrobe data
 */
export function clearWardrobe() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export wardrobe data as JSON
 * @returns {string} - JSON string of wardrobe data
 */
export function exportWardrobe() {
  return JSON.stringify(getWardrobe(), null, 2);
}

/**
 * Import wardrobe data from JSON
 * @param {string} jsonData - JSON string to import
 * @returns {boolean} - Success status
 */
export function importWardrobe(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    saveWardrobe(data);
    return true;
  } catch (error) {
    console.error('Error importing wardrobe:', error);
    return false;
  }
}

export default {
  getWardrobe,
  saveClothingAnalysis,
  saveSkinAnalysis,
  getItemMetadata,
  getSkinAnalysis,
  getAllItems,
  removeItem,
  clearWardrobe,
  exportWardrobe,
  importWardrobe,
};
