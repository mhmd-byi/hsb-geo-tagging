// Global type declaration for mongoose cache
declare global {
  var mongoose: any;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface Mumineen {
  _id: string;
  its_id: number;
  hof_id?: number;
  full_name: string;
  age?: number;
  gender?: string;
  sabil_no: number;
  sector?: string;
  contact_no?: string;
  misaq?: string;
  marital_status?: string;
  address?: string;
  musaed_name?: string;
  musaed_contact?: string;
}

export interface GeoTag {
  _id?: string;
  sabilNo: string;
  name: string;
  description?: string;
  location: GeoLocation;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGeoTagData {
  sabilNo: string;
  name: string;
  description?: string;
  location: GeoLocation;
  category?: string;
  tags?: string[];
}

export interface UpdateGeoTagData {
  sabilNo?: string;
  name?: string;
  description?: string;
  location?: Partial<GeoLocation>;
  category?: string;
  tags?: string[];
}
