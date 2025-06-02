export async function getPosts() {
  try {
    // ...existing code that calls Appwrite...
  } catch (err) {
    console.error("Appwrite service :: getPosts :: error", err);
    // unauthorized → no posts
    if (err.code === 401) return [];
    throw err;
  }
}
