// Test script to verify cache functionality
const { updateContentSection, getContentSection, debugCacheState } = require('./src/lib/content-server.ts');

async function testCache() {
  console.log('🧪 Testing cache functionality...\n');
  
  // 1. Check initial cache state
  console.log('1. Initial cache state:');
  debugCacheState();
  console.log('\n');
  
  // 2. Try to get hero_section (should be empty initially)
  console.log('2. Getting hero_section (should be null initially):');
  const initialContent = await getContentSection('hero_section');
  console.log('Result:', initialContent);
  console.log('\n');
  
  // 3. Update hero_section with new content
  console.log('3. Updating hero_section with test content:');
  const updateResult = await updateContentSection('hero_section', {
    title: 'Test Hero Title',
    subtitle: 'Test Hero Subtitle',
    description: 'Test Hero Description'
  }, 'Hero Section', 'test-user');
  console.log('Update result:', updateResult);
  console.log('\n');
  
  // 4. Check cache state after update
  console.log('4. Cache state after update:');
  debugCacheState();
  console.log('\n');
  
  // 5. Get hero_section again (should now have cached content)
  console.log('5. Getting hero_section (should now have cached content):');
  const updatedContent = await getContentSection('hero_section');
  console.log('Result:', updatedContent);
  console.log('\n');
  
  // 6. Final cache state
  console.log('6. Final cache state:');
  debugCacheState();
}

testCache().catch(console.error);