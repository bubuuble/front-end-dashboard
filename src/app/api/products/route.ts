// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const response = await axios.get(`http://localhost:8001/api/web/v1/products`, {
      params: Object.fromEntries(searchParams.entries()),
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('[API_PRODUCTS_GET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}