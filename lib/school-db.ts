import type { School } from "@/app/data";

export type SchoolRow = {
  id: string;
  short_name: string;
  name: string;
  discipline: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  color: string;
  workshops: string[] | null;
  schedule: string;
  teachers: string[] | null;
  source: string;
  status: "verified" | "review";
  note: string | null;
  updated_at?: string;
};

export function fromSchoolRow(row: SchoolRow): School {
  return {
    id: row.id,
    shortName: row.short_name,
    name: row.name,
    discipline: row.discipline,
    locality: row.locality,
    address: row.address,
    lat: Number(row.latitude),
    lng: Number(row.longitude),
    color: row.color,
    workshops: Array.isArray(row.workshops) ? row.workshops : [],
    schedule: row.schedule,
    teachers: Array.isArray(row.teachers) ? row.teachers : [],
    source: row.source,
    status: row.status,
    note: row.note ?? undefined,
  };
}

export function toSchoolRow(school: School): SchoolRow {
  return {
    id: school.id,
    short_name: school.shortName,
    name: school.name,
    discipline: school.discipline,
    locality: school.locality,
    address: school.address,
    latitude: school.lat,
    longitude: school.lng,
    color: school.color,
    workshops: school.workshops,
    schedule: school.schedule,
    teachers: school.teachers,
    source: school.source,
    status: school.status ?? "verified",
    note: school.note ?? null,
    updated_at: new Date().toISOString(),
  };
}
