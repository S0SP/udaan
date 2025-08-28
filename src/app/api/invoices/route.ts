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

    // Check if an invoice from this vendor already exists
    if (body.vendorName) {
      const existingInvoice = await db.collection(COLLECTIONS.INVOICES).findOne({
        vendorName: body.vendorName,
      });

      if (existingInvoice) {
        return NextResponse.json(
          { error: 'Stock for this vendor has already been updated.' },
          { status: 409 } // Conflict
        );
      }
    }

    // Store invoice data
    const invoiceResult = await db.collection(COLLECTIONS.INVOICES).insertOne(invoiceData);

    // After saving invoice, update the products collection
    const productOperations = body.items.map(async (item) => {
      const barcodeInfo = await db.collection(COLLECTIONS.BARCODES).findOne({ name: item.name });
      const existingProduct = await db.collection(COLLECTIONS.PRODUCTS).findOne({ name: item.name });

      if (existingProduct) {
        // If product exists, increment its quantity
        await db.collection(COLLECTIONS.PRODUCTS).updateOne(
          { _id: existingProduct._id },
          { $inc: { quantity: item.quantity } }
        );
      } else {
        // If product does not exist, create a new one
        await db.collection(COLLECTIONS.PRODUCTS).insertOne({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: body.vendorName || 'Uncategorized',
          imageUrl: barcodeInfo?.imageUrl || '',
          barcode: barcodeInfo?.barcode || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return { ...item, barcode: barcodeInfo?.barcode || '' };
    });

    const processedItems = await Promise.all(productOperations);

    return NextResponse.json({
      success: true,
      invoiceId: invoiceResult.insertedId,
      items: processedItems,
      message: 'Invoice and products stored successfully'
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
