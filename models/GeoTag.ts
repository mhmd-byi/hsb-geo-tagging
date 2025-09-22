import mongoose, { Schema, Document } from 'mongoose';
import { GeoLocation } from '../lib/types';

export interface IGeoTag extends Document {
  sabilNo: string;
  name: string;
  description?: string;
  location: GeoLocation;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GeoLocationSchema = new Schema<GeoLocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
  city: { type: String },
  country: { type: String }
}, { _id: false });

const GeoTagSchema = new Schema<IGeoTag>({
  sabilNo: { type: String, required: true, trim: true, unique: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  location: { type: GeoLocationSchema, required: true },
  category: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
GeoTagSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
GeoTagSchema.index({ location: '2dsphere' });
GeoTagSchema.index({ category: 1 });
GeoTagSchema.index({ tags: 1 });
GeoTagSchema.index({ sabilNo: 1 });

export default mongoose.models.GeoTag || mongoose.model<IGeoTag>('GeoTag', GeoTagSchema);
