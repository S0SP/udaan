import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  if (!barcode) {
    return NextResponse.json({ error: 'Barcode is required' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const product = await db.collection(COLLECTIONS.BARCODES).findOne({ barcode: barcode });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Assuming the 'barcodes' collection stores price and other details.
    // If price is in a different collection, we'd need to fetch it from there.
    const productDetails = {
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price || 0, // Default price to 0 if not available
      barcode: product.barcode,
      quantity: product.quantity, // Assuming quantity is here
    };

    return NextResponse.json(productDetails);
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 });
  }
}
