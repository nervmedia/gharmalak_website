import { JoinFormInput, normalizeIndianPhone } from '../data/clubData';

export interface ClubStats {
  members: number;
  optins: number;
}

const LOCAL_STATS_KEY = 'gm_club_stats_v1';
const LOCAL_MEMBERS_KEY = 'gm_club_members_v1';
const LOCAL_OPTINS_KEY = 'gm_club_optins_v1';

function getLocalState(): {
  stats: ClubStats;
  members: string[];
  optins: string[];
} {
  try {
    const rawStats = localStorage.getItem(LOCAL_STATS_KEY);
    const rawMembers = localStorage.getItem(LOCAL_MEMBERS_KEY);
    const rawOptins = localStorage.getItem(LOCAL_OPTINS_KEY);
    const members: string[] = rawMembers ? JSON.parse(rawMembers) : ['9823000001'];
    const optins: string[] = rawOptins ? JSON.parse(rawOptins) : ['9823000001'];
    const stats: ClubStats = rawStats
      ? JSON.parse(rawStats)
      : { members: Math.max(1, members.length), optins: Math.max(1, optins.length) };
    return { stats, members, optins };
  } catch {
    return { stats: { members: 1, optins: 1 }, members: ['9823000001'], optins: ['9823000001'] };
  }
}

function saveLocalState(state: { stats: ClubStats; members: string[]; optins: string[] }) {
  try {
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(state.stats));
    localStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify(state.members));
    localStorage.setItem(LOCAL_OPTINS_KEY, JSON.stringify(state.optins));
  } catch {
    // ignore storage errors
  }
}

export async function fetchClubStats(): Promise<ClubStats> {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.members === 'number' && typeof data?.optins === 'number') {
        const local = getLocalState();
        const merged = {
          members: Math.max(data.members, local.stats.members),
          optins: Math.max(data.optins, local.stats.optins),
        };
        return merged;
      }
    }
  } catch {
    // fallback to local
  }
  return getLocalState().stats;
}

export async function submitMemberRegistration(
  form: JoinFormInput & { lang: string; source: string }
): Promise<{ status: 'pending' | 'paid'; memberNumber: string }> {
  const cleanPhone = normalizeIndianPhone(form.phone);
  const local = getLocalState();
  if (!local.members.includes(cleanPhone)) {
    local.members.push(cleanPhone);
    local.stats.members = Math.max(local.stats.members + 1, local.members.length);
  }
  if (form.interests.includes('solar') && !local.optins.includes(cleanPhone)) {
    local.optins.push(cleanPhone);
    local.stats.optins = Math.max(local.stats.optins + 1, local.optins.length);
  }
  saveLocalState(local);

  try {
    localStorage.setItem('gm_phone', cleanPhone);
    localStorage.setItem('gm_name', form.name.trim());
  } catch {
    // ignore
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, phone: cleanPhone }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        status: data.status === 'paid' ? 'paid' : 'pending',
        memberNumber: data.memberNumber || `GM · ${String(local.stats.members).padStart(4, '0')} · NGP`,
      };
    }
  } catch {
    // fallback
  }

  return {
    status: 'pending',
    memberNumber: `GM · ${String(local.stats.members).padStart(4, '0')} · NGP`,
  };
}

export async function submitRoundOptIn(
  phone: string
): Promise<{ status: 'done' | 'already' | 'notmember' | 'error'; created?: boolean }> {
  const cleanPhone = normalizeIndianPhone(phone);
  try {
    const res = await fetch('/api/optin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone }),
    });
    if (res.status === 404) {
      const local = getLocalState();
      if (!local.members.includes(cleanPhone)) {
        return { status: 'notmember' };
      }
    }
    if (res.ok) {
      const data = await res.json();
      const local = getLocalState();
      if (!local.optins.includes(cleanPhone)) {
        local.optins.push(cleanPhone);
        local.stats.optins += 1;
        saveLocalState(local);
      }
      return {
        status: data.created ? 'done' : 'already',
        created: !!data.created,
      };
    }
  } catch {
    // fallback to local check
  }

  const local = getLocalState();
  if (!local.members.includes(cleanPhone)) {
    return { status: 'notmember' };
  }
  if (local.optins.includes(cleanPhone)) {
    return { status: 'already', created: false };
  }
  local.optins.push(cleanPhone);
  local.stats.optins += 1;
  saveLocalState(local);
  return { status: 'done', created: true };
}

export async function submitDealsInterest(payload: {
  deals: string[];
  name: string;
  phone: string;
  city: string;
  consent: boolean;
  source: string;
}): Promise<{ count: number; member: boolean }> {
  const cleanPhone = normalizeIndianPhone(payload.phone);
  try {
    localStorage.setItem('gm_phone', cleanPhone);
  } catch {
    // ignore
  }

  try {
    const res = await fetch('/api/deals/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, phone: cleanPhone }),
    });
    if (res.ok) {
      const data = await res.json();
      return { count: payload.deals.length, member: !!data.member };
    }
  } catch {
    // fallback
  }

  const local = getLocalState();
  return {
    count: payload.deals.length,
    member: local.members.includes(cleanPhone),
  };
}
