/**
 * @file supabaseClient.js
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Supabase Client Initialization & Environment Configuration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : undefined);
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : undefined);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  !supabaseUrl.includes('placeholder')
);

/**
 * Resilient fetch implementation for Supabase.
 * Automatically retries transient network interruptions and falls back to
 * the local Vite dev proxy (/api/supabase) if direct connection to *.supabase.co
 * is blocked by browser adblockers, CORS, or local network firewalls.
 */
async function resilientFetch(input, init) {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input?.url;

  // Try direct fetch first
  try {
    const response = await fetch(input, init);
    return response;
  } catch (primaryError) {
    const errMsg = primaryError?.message?.toLowerCase() || '';
    const isNetworkError = primaryError instanceof TypeError || errMsg.includes('fetch') || errMsg.includes('network');

    // If we're in the browser on localhost and direct fetch failed (e.g. adblocker, CORS, network reset),
    // attempt proxying through Vite dev server's /api/supabase proxy!
    if (isNetworkError && typeof window !== 'undefined' && supabaseUrl && url && url.startsWith(supabaseUrl)) {
      try {
        const proxiedUrl = url.replace(supabaseUrl, `${window.location.origin}/api/supabase`);
        console.warn(`[QueueLess AI] Direct Supabase fetch failed. Retrying via local dev proxy: ${proxiedUrl}`);
        const proxyResponse = await fetch(proxiedUrl, init);
        return proxyResponse;
      } catch (proxyError) {
        console.warn('[QueueLess AI] Proxy fallback also failed:', proxyError.message);
      }
    }

    // Try one retry after 400ms for transient connection drops
    if (isNetworkError) {
      await new Promise(r => setTimeout(r, 400));
      try {
        return await fetch(input, init);
      } catch (retryError) {
        // Enhance error message to be clear and user-friendly instead of raw "Failed to fetch"
        const friendlyError = new Error(
          'Unable to connect to the authentication server. Please check your internet connection or verify that network firewalls/ad-blockers are not blocking Supabase.'
        );
        friendlyError.originalError = retryError;
        friendlyError.name = 'AuthRetryableFetchError';
        throw friendlyError;
      }
    }

    throw primaryError;
  }
}

/**
 * Live Supabase client instance (or null if not configured)
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: resilientFetch,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '[QueueLess AI] Supabase credentials not found or unconfigured.'
  );
} else {
  console.info('[QueueLess AI] Supabase client initialized securely with resilient network gateway.');
}

