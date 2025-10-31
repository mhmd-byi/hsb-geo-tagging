import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../lib/mongodb';
import Mumineen from '../../../models/Mumineen';
import { authOptions } from '@/lib/auth';

// GET - Search mumineens by sabil no
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
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

    let query: any = {};
    
    // Parse as number and search by exact match
    const sabilNoNum = parseInt(sabilNo.trim());
    
    if (!isNaN(sabilNoNum)) {
      query.sabil_no = sabilNoNum;
    } else {
      // If not a valid number, return empty results
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

    const skip = (page - 1) * limit;
    
    // For users with 'user' role, only show HOF (where its_id === hof_id)
    if (session?.user?.role === 'user') {
      query.$expr = { $eq: ['$its_id', '$hof_id'] };
    }
    
            const [mumineens, total] = await Promise.all([
              Mumineen.find(query)
                .sort({ age: -1, _id: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
              Mumineen.countDocuments(query)
            ]);

    return NextResponse.json({
      success: true,
      data: mumineens,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching mumineens:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search mumineens' },
      { status: 500 }
    );
  }
}
