import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

console.log("ENV DEBUG:", {
  key: process.env.GOOGLE_API_KEY?.slice(0, 10),
  model: process.env.GEMINI_MODEL
});


// 🔹 Enhance Professional Summary
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    console.log("🔹 enhanceProfessionalSummary HIT");

    const { userContent } = req.body;
    console.log("INPUT:", userContent);

    if (!userContent) {
      return res.status(400).json({ message: "Please enter your professional summary" });
    }

    const result = await ai.generateContent(
      `You are a professional resume writer. Improve this professional summary and return ONLY a single concise paragraph (3-5 sentences) with no formatting, no markdown, no options, no explanations - just the improved summary text:

${userContent}`
    );

    const enhancedContent = result.response.text();

    console.log("✅ AI RESPONSE:", enhancedContent);

    return res.status(200).json({ enhancedContent });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return res.status(400).json({
      message: error.message
    });
  }
};


// 🔹 Enhance Job Description
export const enhanceJobDescription = async (req, res) => {
  try {
    console.log("🔹 enhanceJobDescription HIT");

    const { userContent } = req.body;
    console.log("INPUT:", userContent);

    if (!userContent) {
      return res.status(400).json({ message: "Please enter your job description" });
    }

    const result = await ai.generateContent(
      `You are a professional resume writer. Improve this job description and return ONLY the improved text with no formatting, no markdown, no explanations - just the enhanced description:

${userContent}`
    );

    const enhancedContent = result.response.text();

    console.log("✅ AI RESPONSE:", enhancedContent);

    return res.status(200).json({ enhancedContent });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return res.status(400).json({
      message: error.message
    });
  }
};


// 🔹 Upload Resume (Gemini Version)
export const uploadResume = async (req, res) => {
  try {
    console.log("🚀 uploadResume HIT");

    const userId = req.userId;
    const { resumeText, title } = req.body;

    console.log("USER:", userId);
    console.log("TITLE:", title);
    console.log("TEXT LENGTH:", resumeText?.length);

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const safeText = resumeText
      .replace(/[^\x00-\x7F]/g, "")
      .slice(0, 8000);

    console.log("SAFE TEXT LENGTH:", safeText.length);

    const result = await ai.generateContent(
      `Extract data from this resume: ${resumeText}
      provide data in the following JSON format with no additional text before or after:
    {
       professional_summary:{
        type:String,
        default:""
    },
    skills:[{type: String}],
    personal_info:{
        image: {type: String, default:""},
        full_name: {type: String, default:""},
        profession: {type: String, default:""},
        email: {type: String, default:""},
        phone: {type: String, default:""},
        location: {type: String, default:""},
        linkedin: {type: String, default:""},
        website: {type: String, default:""},

    },
    experience:[{
        company: {type: String, default:""},
        position: {type: String, default:""},
        start_date: {type: String, default:""},
        end_date: {type: String, default:""},
        description: {type: String, default:""},
        is_current: {type: Boolean, default:false},
    }],
    education:[{
        institution: {type: String, default:""},
        degree: {type: String, default:""},
        field: {type: String, default:""},
        graduation_date: {type: String, default:""},
        gpa: {type: String },
    }],
    projects:[{
        name: {type: String, default:""},
        type: {type: String, default:""},
        description: {type: String, default:""},
    }]
    }}

${safeText}

Return JSON only.`
    );

    const output = result.response.text();

    console.log("🧠 AI OUTPUT:", output);

    let parsedData;

    try {
      const cleaned = output
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedData = JSON.parse(cleaned);

    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", err);
      parsedData = { rawText: output };
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData
    });

    console.log("✅ SAVED:", newResume._id);

    res.json({ resume: newResume });

  } catch (error) {
    console.error("❌ FULL ERROR:", error);

    res.status(400).json({
      message: error.message
    });
  }
};