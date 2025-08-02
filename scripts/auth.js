// Authentication Check Script
// This script prevents access to protected pages without login

// Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://kijgvbrjjofvtswqkyyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpamd2YnJqam9mdnRzd3FreXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTM0MDUsImV4cCI6MjA2NDI4OTQwNX0.CGx5yeAXYHoeB8NK5qh7FT-3j2I5TvxNCLEfWW0X6xg'
);

// Check if user is authenticated
async function checkAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      // User is not authenticated, redirect to login
      console.log('User not authenticated, redirecting to login...');
      window.location.href = '../index.html';
      return false;
    }
    
    console.log('User authenticated:', user.email);
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = '../index.html';
    return false;
  }
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Skip auth check for index.html and kidmode pages
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath.includes('index.html') || currentPath === '/' || currentPath === '';
  const isKidModePage = currentPath.includes('kidmode/');
  
  if (!isIndexPage && !isKidModePage) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return; // Page will redirect
    }
  }
});

// Handle logout
function logout() {
  supabase.auth.signOut().then(() => {
    window.location.href = '../index.html';
  });
}

// Make logout function globally available
window.logout = logout;

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // User signed out, redirect to login
    if (!window.location.pathname.includes('index.html')) {
      window.location.href = '../index.html';
    }
  }
}); 