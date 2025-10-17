const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Project Setup...\n');

// Check 1: Tailwind config exists
const tailwindConfig = path.join(__dirname, '../tailwind.config.js');
if (fs.existsSync(tailwindConfig)) {
  console.log('✅ tailwind.config.js exists');
  const content = fs.readFileSync(tailwindConfig, 'utf8');
  if (content.includes('#D946EF')) {
    console.log('✅ TortoiseAI primary color found');
  } else {
    console.log('❌ TortoiseAI colors NOT found - needs update');
  }
} else {
  console.log('❌ tailwind.config.js missing');
}

// Check 2: PostCSS config
const postcssConfig = path.join(__dirname, '../postcss.config.js');
if (fs.existsSync(postcssConfig)) {
  console.log('✅ postcss.config.js exists');
} else {
  console.log('❌ postcss.config.js missing');
}

// Check 3: Index CSS
const indexCSS = path.join(__dirname, '../src/index.css');
if (fs.existsSync(indexCSS)) {
  console.log('✅ src/index.css exists');
  const content = fs.readFileSync(indexCSS, 'utf8');
  if (content.includes('@tailwind base')) {
    console.log('✅ Tailwind directives found');
  } else {
    console.log('❌ Tailwind directives missing');
  }
  if (content.includes('Inter')) {
    console.log('✅ Inter font import found');
  } else {
    console.log('❌ Inter font import missing');
  }
} else {
  console.log('❌ src/index.css missing');
}

// Check 4: Package.json dependencies
const packageJson = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJson)) {
  const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  console.log('✅ package.json exists');

  const required = ['react', 'react-dom', 'tailwindcss', '@supabase/supabase-js', 'react-router-dom'];
  required.forEach(dep => {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
      console.log(`✅ ${dep} installed`);
    } else {
      console.log(`❌ ${dep} missing`);
    }
  });
}

console.log('\n✨ Verification complete!');
