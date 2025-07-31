import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration script to move existing images and update paths
const migrateImages = () => {
  // Go up one level from scripts directory to project root
  const projectRoot = path.dirname(__dirname);
  const sourceDir = path.join(projectRoot, 'src/assets/images');
  const destDir = path.join(projectRoot, 'public/uploads/products');
  
  console.log('Project root:', projectRoot);
  console.log('Source directory:', sourceDir);
  console.log('Destination directory:', destDir);
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('Created destination directory');
  }

  // Image mapping - maps old paths to new filenames
  const imageMapping = {
    'Gamepad.png': 'usb-gamepad.png',
    'Keyboard.png': 'keyboard.png',
    'Monitor.png': 'monitor.png',
    'comfort chair.png': 'comfort-chair.png',
    'bookshelf.png': 'bookshelf.png',
    'Liquid cooling system.png': 'liquid-cooling.png',
    'North coat.png': 'north-coat.png',
    'Gucci duffle bag.png': 'gucci-bag.png',
    'dog food.png': 'dog-food.png',
    'canon camera.png': 'canon-camera.png',
    'Gaming laptop.png': 'gaming-laptop.png',
    'curology-j7pKVQrTUsM-unsplash 1.png': 'curology.png',
    'Kids car.png': 'kids-car.png',
    'soccer cleats.png': 'soccer-cleats.png',
    'USB Gamepad.png': 'usb-gamepad.png',
    'Satin jacket.png': 'satin-jacket.png'
  };

  console.log('Starting image migration...');

  let successCount = 0;
  let errorCount = 0;

  Object.entries(imageMapping).forEach(([oldName, newName]) => {
    const sourcePath = path.join(sourceDir, oldName);
    const destPath = path.join(destDir, newName);

    try {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✓ Migrated: ${oldName} → ${newName}`);
        successCount++;
      } else {
        console.log(`⚠ Warning: ${oldName} not found in source directory`);
        console.log(`   Expected at: ${sourcePath}`);
      }
    } catch (error) {
      console.error(`✗ Error migrating ${oldName}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n=== Migration Summary ===');
  console.log(`Successfully migrated: ${successCount} files`);
  console.log(`Errors: ${errorCount} files`);
  console.log('Image migration completed!');
  
  // Return the mapping for database updates
  return imageMapping;
};

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateImages();
}

export { migrateImages };