import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { barcode } = await request.json();

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 }
      );
    }

    // Find the product by barcode
    const barcodeEntry = await db.collection(COLLECTIONS.BARCODES).findOne({
      barcode: barcode
    });

    if (!barcodeEntry) {
      return NextResponse.json(
        { error: 'Product not found with this barcode' },
        { status: 404 }
      );
    }

    // Find the latest invoice data for this product to get current stock
    const latestInvoice = await db.collection(COLLECTIONS.INVOICES)
      .findOne(
        { 
          'items.name': barcodeEntry.name 
        },
        { 
          sort: { createdAt: -1 } 
        }
      );

    let currentStock = 0;
    if (latestInvoice) {
      const productItem = latestInvoice.items.find((item: any) => item.name === barcodeEntry.name);
      currentStock = productItem ? productItem.quantity : 0;
    }

    // Return product information
    const productInfo = {
      name: barcodeEntry.name,
      barcode: barcodeEntry.barcode,
      imageUrl: barcodeEntry.imageUrl,
      quantity: currentStock,
      price: latestInvoice ? 
        latestInvoice.items.find((item: any) => item.name === barcodeEntry.name)?.price || 0 : 0
    };

    return NextResponse.json({
      success: true,
      product: productInfo
    });

  } catch (error) {
    console.error('Error scanning barcode:', error);
    return NextResponse.json(
      { error: 'Failed to scan barcode' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { barcode, action } = await request.json();

    if (!barcode || !action) {
      return NextResponse.json(
        { error: 'Barcode and action are required' },
        { status: 400 }
      );
    }

    // Find the product by barcode
    const barcodeEntry = await db.collection(COLLECTIONS.BARCODES).findOne({
      barcode: barcode
    });

    if (!barcodeEntry) {
      return NextResponse.json(
        { error: 'Product not found with this barcode' },
        { status: 404 }
      );
    }

    // Find the latest invoice for this product
    const latestInvoice = await db.collection(COLLECTIONS.INVOICES)
      .findOne(
        { 
          'items.name': barcodeEntry.name 
        },
        { 
          sort: { createdAt: -1 } 
        }
      );

    if (!latestInvoice) {
      return NextResponse.json(
        { error: 'No inventory data found for this product' },
        { status: 404 }
      );
    }

    // Update the quantity based on action (sell = decrease by 1)
    const updatedItems = latestInvoice.items.map((item: any) => {
      if (item.name === barcodeEntry.name) {
        const newQuantity = action === 'sell' ? Math.max(0, item.quantity - 1) : item.quantity + 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Create a new invoice entry with updated quantities
    const newInvoiceData = {
      ...latestInvoice,
      _id: undefined, // Remove the original _id
      items: updatedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
      action: action
    };

    // Insert the updated invoice
    await db.collection(COLLECTIONS.INVOICES).insertOne(newInvoiceData);

    // Get the updated product info
    const updatedProduct = updatedItems.find((item: any) => item.name === barcodeEntry.name);

    return NextResponse.json({
      success: true,
      product: {
        name: barcodeEntry.name,
        barcode: barcodeEntry.barcode,
        imageUrl: barcodeEntry.imageUrl,
        quantity: updatedProduct.quantity,
        price: updatedProduct.price
      },
      message: `Product ${action === 'sell' ? 'sold' : 'restocked'} successfully`
    });

  } catch (error) {
    console.error('Error updating product quantity:', error);
    return NextResponse.json(
      { error: 'Failed to update product quantity' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all barcode entries with their latest stock information
    const barcodes = await db.collection(COLLECTIONS.BARCODES).find({}).toArray();
    
    const productsWithStock = await Promise.all(
      barcodes.map(async (barcode) => {
        const latestInvoice = await db.collection(COLLECTIONS.INVOICES)
          .findOne(
            { 'items.name': barcode.name },
            { sort: { createdAt: -1 } }
          );

        let currentStock = 0;
        let price = 0;
        
        if (latestInvoice) {
          const productItem = latestInvoice.items.find((item: any) => item.name === barcode.name);
          if (productItem) {
            currentStock = productItem.quantity;
            price = productItem.price;
          }
        }

        return {
          name: barcode.name,
          barcode: barcode.barcode,
          imageUrl: barcode.imageUrl,
          quantity: currentStock,
          price: price
        };
      })
    );

    return NextResponse.json({
      success: true,
      products: productsWithStock
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
