
import { CreativeFile, GeneratedTest } from '@/types';

// In a real app, this would interact with a backend
// For this demo, we'll use localStorage to simulate persistence

const TESTS_STORAGE_KEY = 'display_tests';
const UPLOADS_DIRECTORY = '/uploads/'; // This would be a server directory in production

// Generate HTML for a test
export const generateTestHtml = (test: Omit<GeneratedTest, 'id' | 'previewUrl'>): string => {
  const timestamp = new Date(test.timestamp).toISOString().replace(/[:.]/g, '-');
  
  // Create HTML content from the test data
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Display Test – ${timestamp}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      padding: 24px;
    }
    .ad {
      border: 1px solid #ddd;
      padding: 4px;
    }
    .ad-info {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
  </style>
  <script>
    window.onload = function() {
      document.querySelectorAll('img[data-imp1]').forEach(img => {
        ['imp1', 'imp2'].forEach(k => {
          const url = img.dataset[k];
          if(url) new Image().src = url;
        });
      });
    };
  </script>
</head>
<body>
  <h1>Display Test - ${test.name}</h1>
  <p>Generated on ${new Date(test.timestamp).toLocaleString()} by ${test.author}</p>
  <div style="display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px;">
`;

  // Add each creative to the HTML
  test.creatives.forEach((creative) => {
    // Use the preview data directly from the creative
    const creativeData = creative.preview;
    
    htmlContent += `
    <div>
      <a href="${creative.clickUrl}" target="_blank" class="ad">
        <img 
          src="${creativeData}" 
          alt="" 
          data-imp1="${creative.impressionUrl1}" 
          data-imp2="${creative.impressionUrl2}"
          width="${creative.width || 'auto'}"
          height="${creative.height || 'auto'}"
        />
      </a>
      <div class="ad-info">
        ${creative.width}×${creative.height} • ${Math.round(creative.file.size / 1024)} KB
        <div>Click URL: ${creative.clickUrl || 'None'}</div>
        <div>Imp 1: ${creative.impressionUrl1 || 'None'}</div>
        <div>Imp 2: ${creative.impressionUrl2 || 'None'}</div>
      </div>
    </div>
  `;
  });

  htmlContent += `
  </div>
</body>
</html>
`;

  return htmlContent;
};

// Save a test to storage
export const saveTest = (test: Omit<GeneratedTest, 'id' | 'previewUrl'>): GeneratedTest => {
  // In a real app, we would send this to a server
  // For this demo, we'll save to localStorage
  
  // Make sure to preserve the original preview data for each creative
  const creativesWithPreviewData = test.creatives.map(creative => ({
    ...creative
  }));
  
  // Generate HTML content with the preserved preview data
  const htmlContent = generateTestHtml({
    ...test,
    creatives: creativesWithPreviewData
  });
  
  // Create a blob URL for preview (in a real app, this would be a file path)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const previewUrl = URL.createObjectURL(blob);
  
  const newTest: GeneratedTest = {
    ...test,
    id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    previewUrl,
  };
  
  // Get existing tests
  const existingTests = getSavedTests();
  
  // Add new test
  localStorage.setItem(
    TESTS_STORAGE_KEY,
    JSON.stringify([...existingTests, newTest])
  );
  
  return newTest;
};

// Get all saved tests
export const getSavedTests = (): GeneratedTest[] => {
  try {
    const tests = localStorage.getItem(TESTS_STORAGE_KEY);
    return tests ? JSON.parse(tests) : [];
  } catch (error) {
    console.error('Failed to parse saved tests', error);
    return [];
  }
};

// Get a specific test by ID
export const getTestById = (id: string): GeneratedTest | undefined => {
  const tests = getSavedTests();
  return tests.find((test) => test.id === id);
};

// Delete a test
export const deleteTest = (id: string): boolean => {
  const tests = getSavedTests();
  const updatedTests = tests.filter((test) => test.id !== id);
  
  if (tests.length !== updatedTests.length) {
    localStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(updatedTests));
    return true;
  }
  
  return false;
};

// Download HTML for a test
export const downloadTestHtml = (test: GeneratedTest): void => {
  const htmlContent = generateTestHtml({
    name: test.name,
    timestamp: test.timestamp,
    creativeCount: test.creativeCount,
    author: test.author,
    creatives: test.creatives,
  });
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `test_${test.name.toLowerCase().replace(/\s+/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
