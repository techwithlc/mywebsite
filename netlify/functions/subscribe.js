const { createClient } = require('@supabase/supabase-js');

// Load Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Use the same env var names for consistency

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Check if Supabase credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key missing in function environment.');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // Initialize Supabase client within the function
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { email } = JSON.parse(event.body);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Please provide a valid email address.' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const lowerCaseEmail = email.trim().toLowerCase();

    // Check if email already exists
    const { data: existingSubscribers, error: selectError } = await supabase
      .from('subscriber')
      .select('email')
      .eq('email', lowerCaseEmail)
      .limit(1);

    if (selectError) {
      console.error('Supabase select error:', selectError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to check subscription status.' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    if (existingSubscribers && existingSubscribers.length > 0) {
      return {
        statusCode: 200, // Return 200 OK even if already subscribed
        body: JSON.stringify({ message: 'This email is already subscribed.', success: true }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Insert email if it doesn't exist
    const { error: insertError } = await supabase
      .from('subscriber')
      .insert([{ email: lowerCaseEmail }]);

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      // Check for unique constraint violation (though less likely with the check above)
      if (insertError.code === '23505') { // PostgreSQL unique violation code
         return {
           statusCode: 200, // Still treat as success from user perspective
           body: JSON.stringify({ message: 'This email is already subscribed.', success: true }),
           headers: { 'Content-Type': 'application/json' },
         };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Subscription failed during insert.' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful!', success: true }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error('Error processing subscription:', error);
    // Handle JSON parsing errors or other unexpected issues
    const errorMessage = error instanceof SyntaxError ? 'Invalid request format.' : 'An unexpected error occurred.';
     return {
       statusCode: error instanceof SyntaxError ? 400 : 500,
       body: JSON.stringify({ message: errorMessage }),
       headers: { 'Content-Type': 'application/json' },
     };
  }
};
