import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      )
    }

    // Get the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    // Prepare the image data
    const imageData = {
      inlineData: {
        data: image,
        mimeType: "image/jpeg",
      },
    }

    // Create the prompt for Gemini AI
    const prompt = `
      Please analyze this handwritten order list and extract the following information:
      1. Product names
      2. Quantities for each product
      
      Format the response as a JSON array of objects with 'name' and 'quantity' fields.
      Example format:
      [
        { "name": "Fortune Aata", "quantity": 5 },
        { "name": "Sugar", "quantity": 2 }
      ]
      
      Only include products that are clearly listed with quantities.
      If a quantity is not specified, assume it's 1.
      Normalize product names to match our catalog (e.g., "atta" to "aata").
    `

    // Generate content with Gemini AI
    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    let items
    try {
      items = JSON.parse(text)
    } catch (error) {
      console.error("Error parsing Gemini AI response:", error)
      return NextResponse.json(
        { error: "Failed to parse order list" },
        { status: 500 }
      )
    }

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error processing order list:", error)
    return NextResponse.json(
      { error: "Failed to process order list" },
      { status: 500 }
    )
  }
} 