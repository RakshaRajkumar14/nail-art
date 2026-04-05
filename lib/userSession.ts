import { supabase } from './supabase';

const USER_SESSION_KEY = 'shivya:user-session';

export interface UserSession {
  email: string;
  name: string;
  source: 'supabase' | 'demo';
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function fallbackName(email: string) {
  const localPart = email.split('@')[0] || 'Guest';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function hasSupabaseCredentials() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function readUserSession() {
  if (!isBrowser()) {
    return null as UserSession | null;
  }

  const raw = window.localStorage.getItem(USER_SESSION_KEY);
  if (!raw) {
    return null as UserSession | null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null as UserSession | null;
  }
}

export function clearUserSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_SESSION_KEY);
}

function storeUserSession(session: UserSession) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
}

export async function signInUser(email: string, password: string) {
  if (hasSupabaseCredentials()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const session: UserSession = {
      email: data.user.email || email,
      name:
        data.user.user_metadata?.name ||
        data.user.user_metadata?.full_name ||
        fallbackName(data.user.email || email),
      source: 'supabase',
    };

    storeUserSession(session);
    return session;
  }

  if (password.trim().length < 4) {
    throw new Error('Use at least 4 characters for the demo password.');
  }

  const session: UserSession = {
    email,
    name: fallbackName(email),
    source: 'demo',
  };
  storeUserSession(session);
  return session;
}

export async function registerUser(name: string, email: string, password: string) {
  if (hasSupabaseCredentials()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
        },
      },
    });

    if (error) {
      throw error;
    }

    const session: UserSession = {
      email: data.user?.email || email,
      name: name.trim() || fallbackName(email),
      source: 'supabase',
    };

    storeUserSession(session);
    return session;
  }

  if (password.trim().length < 4) {
    throw new Error('Use at least 4 characters for the demo password.');
  }

  const session: UserSession = {
    email,
    name: name.trim() || fallbackName(email),
    source: 'demo',
  };
  storeUserSession(session);
  return session;
}

export async function signOutUser() {
  if (hasSupabaseCredentials()) {
    await supabase.auth.signOut();
  }

  clearUserSession();
}

export async function signInWithGoogle() {
  if (!hasSupabaseCredentials()) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
