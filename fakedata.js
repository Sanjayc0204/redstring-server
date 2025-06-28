import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Setup Supabase client
const supabase = createClient(
  "https://eqexjhomkytkfecqglce.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZXhqaG9ta3l0a2ZlY3FnbGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzIxNjcsImV4cCI6MjA2NjEwODE2N30.UFkRQXF-ih4ezkZoydvzPQ1621-Fsx0PFhGxS82HcR0"
);

// Helper to create random vector
const randomVector = (dim = 3072) =>
  Array.from({ length: dim }, () =>
    parseFloat((Math.random() * 2 - 1).toFixed(8))
  );

// Actual upload function
async function uploadMany(n = 15) {
  for (let i = 0; i < n; i++) {
    const mockUser = {
      user_id: faker.string.uuid(),
      name: faker.person.fullName(),
      created_at: new Date().toISOString(),
      contact_info: faker.internet.email(),
      mbti: faker.helpers.arrayElement(['INTJ', 'ENFP', 'ISTP']),
      birthday: faker.date
        .birthdate({ min: 18, max: 35, mode: 'age' })
        .toISOString()
        .split('T')[0],
      school_or_work: faker.company.name(),
      interests: faker.helpers.arrayElement([
        'Startups',
        'AI',
        'Football',
        'Meditation',
        'Mental Health',
        'Soccer',
        'Golf',
      ]),
      profile_photo: faker.image.avatar,
      red_strings_count: faker.number.int({ min: 0, max: 10 }),
      connections_count: faker.number.int({ min: 0, max: 50 }),
      unlock_prompt: "What's your vibe?",
      profile_vector: randomVector(3072),
    };

    console.log(`Uploading user ${i + 1}...`);
    const { data, error } = await supabase
      .from('User_Profile')
      .insert([mockUser]);

    if (error) {
      console.error("Supabase error:", error);
      if (error && typeof error === 'object') {
        console.error("Supabase error keys:", Object.keys(error));
        console.error("Supabase error message:", error.message);
        console.error("Supabase error code:", error.code);
        console.error("Supabase error hint:", error.hint);
      }
      console.log("❌ Upload failed:", error);
    } else {
      console.log('✅ Upload succeeded:', data);
    }
  }
}

uploadMany(16);
