import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Mumineen from '@/models/Mumineen';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admin can access dashboard stats
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get total count of unique sabil numbers (HOF only)
    const totalSabilCount = await Mumineen.countDocuments({
      $expr: { $eq: ['$its_id', '$hof_id'] }
    });

    // Get verified sabil count (HOF only)
    const verifiedSabilCount = await Mumineen.countDocuments({
      $expr: { $eq: ['$its_id', '$hof_id'] },
      verified: true
    });

    // Get unverified sabil count
    const unverifiedSabilCount = totalSabilCount - verifiedSabilCount;

    // Get total users count
    const totalUsersCount = await User.countDocuments();

    // Get verification count by user
    const verificationByUser = await Mumineen.aggregate([
      {
        $match: {
          verified: true,
          verified_by: { $exists: true, $ne: null },
          $expr: { $eq: ['$its_id', '$hof_id'] }
        }
      },
      {
        $group: {
          _id: '$verified_by',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          username: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get recent verifications
    const recentVerifications = await Mumineen.find({
      verified: true,
      verified_at: { $exists: true },
      $expr: { $eq: ['$its_id', '$hof_id'] }
    })
      .select('sabil_no full_name verified_by verified_at')
      .sort({ verified_at: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalSabil: totalSabilCount,
        verifiedSabil: verifiedSabilCount,
        unverifiedSabil: unverifiedSabilCount,
        totalUsers: totalUsersCount,
        verificationByUser: verificationByUser,
        recentVerifications: recentVerifications
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
