import express from "express"
import dotenv from "dotenv"
import {createClient} from "@supabase/supabase-js"
import { GoogleGenAI } from "@google/genai"

dotenv.config()

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ROLE_KEY);

app.post("/compute-embeddings", async (req, res) => {
    const { userId, inputText } = req.body

    console.log("Request received:", { userId, inputText });

    try {
        console.log("Calling Google AI for embeddings...");
        const response = await genAI.models.embedContent({
            model: 'gemini-embedding-exp-03-07',
            contents: inputText,
        });

        console.log("Google AI response:", response);
        console.log("Embeddings:", response.embeddings);

        console.log("Updating Supabase with embeddings...");
        const { error } = await supabase
        .from("User_Profile")
        .update({ profile_vector: response.embeddings[0].values })
        .eq("user_id", userId);

        if (error) {
            console.error("Supabase error:", error);
            console.error("Supabase error type:", typeof error);
            console.error("Supabase error keys:", Object.keys(error));
            return res.status(500).json({ 
                error: "Supabase error", 
                details: error,
                errorMessage: error.message,
                errorCode: error.code,
                errorHint: error.hint
            });
        }

        console.log("Successfully updated user profile");
        return res.status(200).json({ success: true });
    }
    catch (err) {
        console.error("Caught error:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        return res.status(500).json({ error: err.message || "Unknown error", details: err.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

