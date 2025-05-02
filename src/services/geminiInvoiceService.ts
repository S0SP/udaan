import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCNqzsowbbihCkD8ATmSD_94JEzrG7DNJ4';
console.log('API Key available:', !!API_KEY); // Debug log (will only show if key exists, not the key itself)

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Function to convert file to base64
async function fileToGenerativeContent(file: File) {
  try {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result?.toString().split(',')[1];
        resolve(result || '');
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        resolve('');
      };
      reader.readAsDataURL(file);
    });

    const base64Data = await base64EncodedDataPromise;
    console.log('File converted to base64 successfully:', !!base64Data); // Debug log

    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };
  } catch (error) {
    console.error('Error in fileToGenerativeContent:', error);
    throw new Error('Failed to process image file');
  }
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceAnalysisResult {
  items: InvoiceItem[];
  totalAmount: number;
  invoiceDate?: string;
  vendorName?: string;
  invoiceNumber?: string;
}

export async function analyzeInvoice(imageFile: File): Promise<InvoiceAnalysisResult> {
  if (!API_KEY) {
    console.error('Gemini API key not found in environment variables');
    throw new Error('API key not configured. Please check your environment variables.');
  }

  try {
    console.log('Starting invoice analysis...');

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `Analyze this invoice image and extract the following information in a structured format:
1. List of items with their names, quantities, unit prices, and total amounts
2. Total invoice amount
3. Invoice date (if available)
4. Vendor name (if available)
5. Invoice number (if available)

Please format your response exactly like this:
ITEMS:
[Item Name] | [Quantity] | [Unit Price] | [Total]
(repeat for each item)

TOTAL: [Total Amount]
DATE: [Invoice Date]
VENDOR: [Vendor Name]
INVOICE_NO: [Invoice Number]

Important: Keep your response structured exactly as above. For items, use the | character as a separator.`;

    console.log('Converting image to required format...');
    const imageParts = await fileToGenerativeContent(imageFile);
    
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent([prompt, imageParts]);
    
    console.log('Received response from Gemini API');
    const response = await result.response;
    const text = response.text();

    console.log('Processing API response...');
    console.log('Raw response:', text); // Debug log

    // Initialize the result object
    const parsedResult: InvoiceAnalysisResult = {
      items: [],
      totalAmount: 0,
    };

    // Parse the response
    const lines = text.split('\n');
    let isParsingItems = false;

    for (const line of lines) {
      if (line.trim() === 'ITEMS:') {
        isParsingItems = true;
        continue;
      }

      if (line.startsWith('TOTAL:')) {
        isParsingItems = false;
        const totalMatch = line.match(/TOTAL:\s*([\d.]+)/);
        if (totalMatch) {
          parsedResult.totalAmount = parseFloat(totalMatch[1]);
        }
      } else if (line.startsWith('DATE:')) {
        const dateMatch = line.match(/DATE:\s*(.+)/);
        if (dateMatch) {
          parsedResult.invoiceDate = dateMatch[1].trim();
        }
      } else if (line.startsWith('VENDOR:')) {
        const vendorMatch = line.match(/VENDOR:\s*(.+)/);
        if (vendorMatch) {
          parsedResult.vendorName = vendorMatch[1].trim();
        }
      } else if (line.startsWith('INVOICE_NO:')) {
        const invoiceMatch = line.match(/INVOICE_NO:\s*(.+)/);
        if (invoiceMatch) {
          parsedResult.invoiceNumber = invoiceMatch[1].trim();
        }
      } else if (isParsingItems && line.trim()) {
        const parts = line.split('|').map((part: string) => part.trim());
        if (parts.length === 4) {
          parsedResult.items.push({
            name: parts[0],
            quantity: parseFloat(parts[1]),
            price: parseFloat(parts[2]),
            total: parseFloat(parts[3])
          });
        }
      }
    }

    console.log('Parsed result:', parsedResult); // Debug log
    return parsedResult;
  } catch (error) {
    console.error('Detailed error in analyzeInvoice:', error);
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('Failed to analyze invoice. Please check the console for details.');
  }
} 