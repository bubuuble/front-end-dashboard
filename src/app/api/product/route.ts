// src/app/api/product/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = 'http://localhost:8001/api/web/v1/product';

// Membuat produk baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(EXTERNAL_API_URL, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[API_PRODUCT_POST_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Mengupdate produk
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.put(EXTERNAL_API_URL, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[API_PRODUCT_PUT_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Menghapus produk
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }
    
    const response = await axios.delete(EXTERNAL_API_URL, { 
        data: { product_id: productId } 
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[API_PRODUCT_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}