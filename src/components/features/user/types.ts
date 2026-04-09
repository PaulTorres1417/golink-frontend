
export type ListUserProps = {
  data: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  }
}

export type UserFollowResponse = {
  followUser: boolean;
}

export type UserUnFollowResponse = {
  unFollowUser: boolean;
}