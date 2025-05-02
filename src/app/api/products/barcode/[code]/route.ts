import { NextResponse } from "next/server"

// Mock database of products with barcodes
const productDatabase = new Map([
  ["8901234567890", {
    id: "p1",
    name: "Fortune Chakki Fresh Atta",
    barcode: "8901234567890",
    price: 450,
    category: "groceries",
    subcategory: "flour",
    unit: "kg",
    defaultQuantity: 5,
    inStock: true,
    reorderPoint: 10,
  }],
  ["8901234567891", {
    id: "p2",
    name: "Tata Salt",
    barcode: "8901234567891",
    price: 25,
    category: "groceries",
    subcategory: "spices",
    unit: "kg",
    defaultQuantity: 1,
    inStock: true,
    reorderPoint: 5,
  }],
])

export async function GET(
  request: Request,
  context: { params: { code: string } }
) {
  const barcode = context.params.code

  // In a real application, you would query your database here
  const product = productDatabase.get(barcode)

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(product)
} 