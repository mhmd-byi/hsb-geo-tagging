import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import GeoTag from '../../../models/GeoTag';
import { CreateGeoTagData } from '../../../lib/types';

// GET - Fetch geo tags by sabil no only
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sabilNo = searchParams.get('sabilNo');

    // Only return results if sabilNo is provided
    if (!sabilNo || sabilNo.trim() === '') {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    let query: any = {
      sabilNo: { $regex: sabilNo.trim(), $options: 'i' } // Case-insensitive search
    };

    const skip = (page - 1) * limit;
    
    const [geotags, total] = await Promise.all([
      GeoTag.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      GeoTag.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: geotags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching geo tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch geo tags' },
      { status: 500 }
    );
  }
}

// POST - Create a new geo tag
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body: CreateGeoTagData = await request.json();
    
    // Validate required fields
    if (!body.sabilNo || !body.name || !body.location || !body.location.latitude || !body.location.longitude) {
      return NextResponse.json(
        { success: false, error: 'Sabil No, Name and location (latitude, longitude) are required' },
        { status: 400 }
      );
    }

    const geotag = new GeoTag(body);
    const savedGeotag = await geotag.save();

    return NextResponse.json({
      success: true,
      data: savedGeotag
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating geo tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create geo tag' },
      { status: 500 }
    );
  }
}
