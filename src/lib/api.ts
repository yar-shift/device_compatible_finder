import { supabase } from './supabase';
import type { Device, DeviceWithCompatibilities, CompatibilityRequest, PartType } from '../types/database';

export async function searchDevices(query: string): Promise<Device[]> {
  if (!query.trim()) return [];

  const q = `%${query.toLowerCase()}%`;

  const { data: directMatches } = await supabase
    .from('devices')
    .select('*')
    .or(`model.ilike.${q},brand.ilike.${q},model_code.ilike.${q}`)
    .order('brand')
    .limit(20);

  const { data: aliasMatches } = await supabase
    .from('device_aliases')
    .select('device_id, devices(*)')
    .ilike('alias', q)
    .limit(10);

  const seen = new Set<string>();
  const results: Device[] = [];

  for (const d of directMatches ?? []) {
    if (!seen.has(d.id)) {
      seen.add(d.id);
      results.push(d);
    }
  }

  for (const row of aliasMatches ?? []) {
    const dev = (row as { device_id: string; devices: Device }).devices;
    if (dev && !seen.has(dev.id)) {
      seen.add(dev.id);
      results.push(dev);
    }
  }

  return results;
}

export async function getDevice(id: string): Promise<DeviceWithCompatibilities | null> {
  const { data: device } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!device) return null;

  const { data: compatibilities } = await supabase
    .from('compatibilities')
    .select('*, parts(*)')
    .eq('device_id', id)
    .eq('status', 'active');

  const batteries = (compatibilities ?? [])
    .filter((c) => c.type === 'battery')
    .map((c) => ({
      id: c.id,
      name: c.parts!.name,
      brand: c.parts!.brand,
      confidence: c.confidence,
      part_id: c.part_id,
    }));

  const glasses = (compatibilities ?? [])
    .filter((c) => c.type === 'glass')
    .map((c) => ({
      id: c.id,
      name: c.parts!.name,
      brand: c.parts!.brand,
      confidence: c.confidence,
      part_id: c.part_id,
    }));

  const displays = (compatibilities ?? [])
    .filter((c) => c.type === 'display')
    .map((c) => ({
      id: c.id,
      name: c.parts!.name,
      brand: c.parts!.brand,
      confidence: c.confidence,
      part_id: c.part_id,
    }));

  return { ...device, batteries, glasses, displays };
}

export async function submitCompatibilityRequest(data: {
  device_input: string;
  part_input: string;
  type: PartType;
  comment: string;
}): Promise<void> {
  const { error } = await supabase.from('compatibility_requests').insert({
    device_input: data.device_input,
    part_input: data.part_input,
    type: data.type,
    comment: data.comment || null,
    status: 'pending',
  });
  if (error) throw error;
}

export async function getCompatibilityRequests(): Promise<CompatibilityRequest[]> {
  const { data, error } = await supabase
    .from('compatibility_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateRequestStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  const { error } = await supabase
    .from('compatibility_requests')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function getAllDevices(): Promise<Device[]> {
  const { data } = await supabase.from('devices').select('*').order('brand').order('model');
  return data ?? [];
}
