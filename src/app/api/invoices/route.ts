import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  items: InvoiceItem[];
  totalAmount: number;
  invoiceDate?: string;
  vendorName?: string;
  invoiceNumber?: string;
  createdAt: Date;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Parse JSON with better error handling
    let body: InvoiceData;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid invoice data: items array is required' },
        { status: 400 }
      );
    }

    // Add timestamp
    const invoiceData: InvoiceData = {
      ...body,
      createdAt: new Date()
    };

    // Store invoice data
    const invoiceResult = await db.collection(COLLECTIONS.INVOICES).insertOne(invoiceData);

    // Process each item and create/update barcode entries
    const barcodeOperations = body.items.map(async (item) => {
      // Generate a unique barcode if not exists (you might want to implement proper barcode generation)
      const barcode = `BC${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      
      const barcodeData = {
        name: item.name,
        barcode: barcode,
        imageUrl: body.imageUrl || '/placeholder.svg',
        productId: invoiceResult.insertedId,
        createdAt: new Date()
      };

      // Check if product with this name already exists in barcodes collection
      const existingBarcode = await db.collection(COLLECTIONS.BARCODES).findOne({
        name: item.name
      });

      if (!existingBarcode) {
        // Insert new barcode entry
        await db.collection(COLLECTIONS.BARCODES).insertOne(barcodeData);
      }

      return {
        ...item,
        barcode: existingBarcode?.barcode || barcode
      };
    });

    const processedItems = await Promise.all(barcodeOperations);

    return NextResponse.json({
      success: true,
      invoiceId: invoiceResult.insertedId,
      items: processedItems,
      message: 'Invoice data stored successfully'
    });

  } catch (error) {
    console.error('Error storing invoice data:', error);
    return NextResponse.json(
      { error: 'Failed to store invoice data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const invoices = await db.collection(COLLECTIONS.INVOICES)
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      invoices
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
