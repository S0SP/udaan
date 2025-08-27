# KiraanaKloud - Invoice Scanner & Inventory Management

A modern web application for invoice scanning, barcode management, and inventory tracking built with Next.js, MongoDB, and Gemini AI.

## 🚀 Features

- **Invoice Scanning**: Upload invoice images and extract data using Gemini AI
- **Barcode Management**: Generate and manage unique barcodes for products
- **Real-time Inventory**: Track stock levels with barcode scanning
- **Product Management**: Complete product lifecycle management
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **AI**: Google Gemini AI for invoice analysis
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Google Gemini AI API key

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/kiraanakloud.git
cd kiraanakloud
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
DB_NAME=kiraanakloud
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── barcode/          # Barcode management API
│   │   ├── invoices/         # Invoice storage API
│   │   └── test-mongodb/     # MongoDB connection test
│   ├── shopkeeper/           # Shopkeeper dashboard pages
│   └── layout.tsx
├── components/
│   ├── shopkeeper/           # Shopkeeper components
│   ├── ui/                   # Reusable UI components
│   └── audio-provider.tsx
├── lib/
│   └── mongodb.ts           # MongoDB connection service
└── services/
    └── geminiInvoiceService.ts # Gemini AI integration
```

## 🔧 API Endpoints

### Invoice Management
- `POST /api/invoices` - Store invoice data
- `GET /api/invoices` - Get all invoices

### Barcode Management
- `POST /api/barcode` - Look up product by barcode
- `PUT /api/barcode` - Update stock (sell/restock)
- `GET /api/barcode` - Get all products

## 🗄️ Database Schema

### Invoices Collection
```javascript
{
  items: [
    {
      name: string,
      quantity: number,
      price: number,
      total: number
    }
  ],
  totalAmount: number,
  invoiceDate?: string,
  vendorName?: string,
  invoiceNumber?: string,
  createdAt: Date,
  imageUrl?: string
}
```

### Barcodes Collection
```javascript
{
  name: string,
  barcode: string,
  imageUrl: string,
  productId: ObjectId,
  createdAt: Date
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `DB_NAME`
4. Deploy!

## 📱 Usage

### For Shopkeepers

1. **New Stock Upload**: Upload invoice images to add new products
2. **Inventory Sync**: Scan barcodes to update stock levels
3. **Products Management**: View and manage all products

### Features

- **Invoice Analysis**: AI-powered invoice data extraction
- **Barcode Generation**: Automatic barcode generation for products
- **Stock Tracking**: Real-time inventory updates
- **Product Search**: Search products by name or barcode

## 🔒 Security

- Input validation for all API endpoints
- JSON parsing error handling
- Database connection error handling
- Graceful error responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for invoice analysis
- MongoDB Atlas for database hosting
- Vercel for deployment platform
- Next.js team for the amazing framework

## 📞 Support

For support, email chourasiasumit51@gmail.com or create an issue in the repository.

---

Made with ❤️ by Sumit Chourasia
