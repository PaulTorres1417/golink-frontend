
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

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
};
export type UserListProps = {
  getAllUsers: User[];
}