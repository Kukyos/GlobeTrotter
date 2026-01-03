import express from 'express';
import crypto from 'crypto';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST / - Create a new trip
router.post('/', authenticateToken, async (req, res) => {
  console.log('POST /trips - Creating new trip');
  console.log('User ID:', req.userId);
  console.log('Request body:', req.body);

  try {
    const { name, destination, start_date, end_date, budget, description } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!name || !destination || !start_date || !end_date) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'destination', 'start_date', 'end_date']
      });
    }

    // Generate unique ID
    const tripId = crypto.randomUUID();
    console.log('Generated trip ID:', tripId);

    // Insert trip into database
    const query = `
      INSERT INTO trips (id, user_id, name, destination, start_date, end_date, budget, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      tripId,
      userId,
      name,
      destination,
      start_date,
      end_date,
      budget || null,
      description || null
    ]);

    console.log('Trip created successfully:', tripId);

    // Fetch the created trip
    const [trips] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    const trip = trips[0];

    res.status(201).json({
      message: 'Trip created successfully',
      trip: trip
    });

  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ 
      error: 'Failed to create trip',
      details: error.message 
    });
  }
});

// GET / - Get all trips for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  console.log('GET /trips - Fetching user trips');
  console.log('User ID:', req.userId);

  try {
    const userId = req.userId;

    // Fetch all trips for the user
    const query = `
      SELECT * FROM trips 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;

    const [trips] = await pool.query(query, [userId]);

    console.log(`Found ${trips.length} trips for user ${userId}`);

    res.status(200).json({
      trips: trips,
      count: trips.length
    });

  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trips',
      details: error.message 
    });
  }
});

export default router;
