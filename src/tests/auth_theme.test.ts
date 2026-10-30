import { describe, it, expect } from 'vitest';
import { THEME_OPTIONS } from '../contexts/ThemeContext';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { isFirebaseConfigured, getCurrentLocalUser, setLocalUser } from '../services/firebase';

describe('Smart City Themes & Localization', () => {
  it('supports 5 distinct color themes', () => {
    expect(THEME_OPTIONS).toHaveLength(5);
    const themeIds = THEME_OPTIONS.map((t) => t.id);
    expect(themeIds).toContain('ocean-blue');
    expect(themeIds).toContain('emerald-green');
    expect(themeIds).toContain('midnight-purple');
    expect(themeIds).toContain('sunset-orange');
    expect(themeIds).toContain('minimal-neutral');
  });

  it('supports 6 languages including Arabic with RTL', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(6);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toEqual(['en', 'hi', 'bn', 'es', 'fr', 'ar']);

    const arabic = SUPPORTED_LANGUAGES.find((l) => l.code === 'ar');
    expect(arabic?.dir).toBe('rtl');
  });

  it('gracefully handles user session storage', () => {
    setLocalUser({
      uid: 'test-user-1',
      email: 'test@smartcity.org',
      displayName: 'Test Planner',
      role: 'Urban Designer',
    });

    const user = getCurrentLocalUser();
    expect(user?.uid).toBe('test-user-1');
    expect(user?.email).toBe('test@smartcity.org');

    setLocalUser(null);
    expect(getCurrentLocalUser()).toBeNull();
  });
});
