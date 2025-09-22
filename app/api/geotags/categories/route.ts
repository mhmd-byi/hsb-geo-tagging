import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import GeoTag from '../../../../models/GeoTag';

// GET - Fetch all unique categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const categories = await GeoTag.distinct('category', { category: { $exists: true, $ne: null } });
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
