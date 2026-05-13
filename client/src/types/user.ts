interface user {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  role: string;
  status?: string;
  createAt?: string;
}

interface AuthResponse {
  user: user;
  token: string;
}

export type { AuthResponse, user };
