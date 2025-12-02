const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'appelalacandidature.json');
const content = fs.readFileSync(filePath, 'utf8');

// Split by empty lines to get the three arrays
const parts = content.split(/\n\s*\n/).filter(part => part.trim().length > 0);

if (parts.length !== 3) {
  console.error('Expected 3 arrays, found:', parts.length);
  process.exit(1);
}

// Parse each array
const enArray = JSON.parse(parts[0].trim());
const arArray = JSON.parse(parts[1].trim());
const frArray = JSON.parse(parts[2].trim());

console.log(`English entries: ${enArray.length}`);
console.log(`Arabic entries: ${arArray.length}`);
console.log(`French entries: ${frArray.length}`);

// Check if arrays have the same length
if (enArray.length !== arArray.length || enArray.length !== frArray.length) {
  console.warn('Warning: Arrays have different lengths!');
}

// Merge arrays into the new format
const merged = [];

const maxLength = Math.max(enArray.length, arArray.length, frArray.length);

for (let i = 0; i < maxLength; i++) {
  const enItem = enArray[i];
  const arItem = arArray[i];
  const frItem = frArray[i];

  // Get shared image and url (prefer non-null values)
  const image = enItem?.image || arItem?.image || frItem?.image || null;
  const url = enItem?.url || arItem?.url || frItem?.url || null;

  const mergedItem = {
    image: image,
    url: url
  };

  // Add language-specific data
  if (enItem) {
    mergedItem.en = {
      title: enItem.title || '',
      summary: enItem.summary || '',
      date: enItem.date || ''
    };
  }

  if (arItem) {
    mergedItem.ar = {
      title: arItem.title || '',
      summary: arItem.summary || '',
      date: arItem.date || ''
    };
  }

  if (frItem) {
    mergedItem.fr = {
      title: frItem.title || '',
      summary: frItem.summary || '',
      date: frItem.date || ''
    };
  }

  merged.push(mergedItem);
}

// Write the merged file
const outputPath = path.join(__dirname, 'appelalacandidature-merged.json');
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf8');

console.log(`\n✅ Successfully merged ${merged.length} items`);
console.log(`📄 Output file: ${outputPath}`);
console.log(`\nThe file is now ready to import!`);
