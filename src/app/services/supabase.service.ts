import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        autoRefreshToken: true,
        persistSession: true,
      }
    );
  }

  get user() {
    return this.supabase.auth.user();
  }

  get session() {
    return this.supabase.auth.session();
  }

  async download(bucket: string, path: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);
    return { data, error };
  }

  async listFilesInBucket(bucket: string, path?: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path || '');
    //console.log('data', data);

    return { data, error };
  }

  fnWrapper(fn: Promise<{ data: any; error: any }>) {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await fn;
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }
}
