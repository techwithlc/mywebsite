import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// Get all blog posts (public - only published posts)
router.get('/posts', async (req, res) => {
  try {
    const { language, category, featured, limit, offset } = req.query;
    
    let query = `
      SELECT 
        id, title, excerpt, author, slug, cover_image,
        status, featured, language, category, tags,
        read_time, views, published_at, created_at, updated_at
      FROM blog_posts
      WHERE status = 'published'
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (language) {
      query += ` AND language = $${paramCount}`;
      params.push(language);
      paramCount++;
    }
    
    if (category && category !== 'all') {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }
    
    if (featured === 'true') {
      query += ` AND featured = true`;
    }
    
    query += ` ORDER BY published_at DESC`;
    
    if (limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
      paramCount++;
    }
    
    if (offset) {
      query += ` OFFSET $${paramCount}`;
      params.push(parseInt(offset));
    }
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      posts: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error.message
    });
  }
});

// Get single blog post by slug (public)
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM blog_posts 
       WHERE slug = $1 AND status = 'published'`,
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Increment view count
    await pool.query(
      'UPDATE blog_posts SET views = views + 1 WHERE slug = $1',
      [slug]
    );
    
    res.json({
      success: true,
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    });
  }
});

// ============ ADMIN ENDPOINTS (Add authentication later) ============

// Get all posts including drafts (admin)
router.get('/admin/posts', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM blog_posts';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      posts: result.rows
    });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
});

// Get single post by ID (admin)
router.get('/admin/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    });
  }
});

// Create new blog post (admin)
router.post('/admin/posts', async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      slug,
      cover_image,
      status,
      featured,
      language,
      category,
      tags,
      read_time
    } = req.body;
    
    // Validate required fields
    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, excerpt, and content are required'
      });
    }
    
    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Date.now();
    
    // Calculate read time if not provided (avg 200 words per minute)
    const finalReadTime = read_time || Math.ceil(content.split(/\s+/).length / 200);
    
    const result = await pool.query(
      `INSERT INTO blog_posts 
       (title, excerpt, content, author, slug, cover_image, status, featured, 
        language, category, tags, read_time, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        title,
        excerpt,
        content,
        author || 'Lawrence Chen',
        finalSlug,
        cover_image || null,
        status || 'draft',
        featured || false,
        language || 'en',
        category || 'tutorials',
        tags || [],
        finalReadTime,
        status === 'published' ? new Date() : null
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
});

// Update blog post (admin)
router.put('/admin/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      author,
      slug,
      cover_image,
      status,
      featured,
      language,
      category,
      tags,
      read_time
    } = req.body;
    
    // Check if post exists
    const existingPost = await pool.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [id]
    );
    
    if (existingPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramCount = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      params.push(title);
      paramCount++;
    }
    
    if (excerpt !== undefined) {
      updates.push(`excerpt = $${paramCount}`);
      params.push(excerpt);
      paramCount++;
    }
    
    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      params.push(content);
      paramCount++;
      
      // Recalculate read time
      const newReadTime = Math.ceil(content.split(/\s+/).length / 200);
      updates.push(`read_time = $${paramCount}`);
      params.push(newReadTime);
      paramCount++;
    }
    
    if (author !== undefined) {
      updates.push(`author = $${paramCount}`);
      params.push(author);
      paramCount++;
    }
    
    if (slug !== undefined) {
      updates.push(`slug = $${paramCount}`);
      params.push(slug);
      paramCount++;
    }
    
    if (cover_image !== undefined) {
      updates.push(`cover_image = $${paramCount}`);
      params.push(cover_image);
      paramCount++;
    }
    
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;
      
      // Set published_at if changing to published
      if (status === 'published' && existingPost.rows[0].status !== 'published') {
        updates.push(`published_at = $${paramCount}`);
        params.push(new Date());
        paramCount++;
      }
    }
    
    if (featured !== undefined) {
      updates.push(`featured = $${paramCount}`);
      params.push(featured);
      paramCount++;
    }
    
    if (language !== undefined) {
      updates.push(`language = $${paramCount}`);
      params.push(language);
      paramCount++;
    }
    
    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      params.push(category);
      paramCount++;
    }
    
    if (tags !== undefined) {
      updates.push(`tags = $${paramCount}`);
      params.push(tags);
      paramCount++;
    }
    
    if (read_time !== undefined) {
      updates.push(`read_time = $${paramCount}`);
      params.push(read_time);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    params.push(id);
    const query = `
      UPDATE blog_posts 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
});

// Delete blog post (admin)
router.delete('/admin/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
});

export default router;

