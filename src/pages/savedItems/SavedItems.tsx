import styled from "styled-components";
import { useQuery } from "@apollo/client/react";
import { SAVED_POST_QUERY, SAVED_COMMENT_QUERY } from "../../graphql/query";
import { PostContent } from "@features/post";
import type { PostQueryProps } from "@features/post/types";
import { Comment } from "@features/comment";
import { Avatar, Spinner } from "@components/ui";
import type { CommentProps } from "../post/types";
import { BsBookmark } from "react-icons/bs";

export type SavedPostProps = {
  getSavedPosts: PostQueryProps[];
}

export type SavedCommentProps = {
  getSavedComment: CommentProps[];
}
export const SavedItems = () => {
  const { data, loading, error } = useQuery<SavedPostProps>(SAVED_POST_QUERY);
  const { data: commentData, loading: loadingComments } = useQuery<SavedCommentProps>(SAVED_COMMENT_QUERY);

  if (loading || loadingComments) {
    return <Load><Spinner /></Load>
  }
  if (error) return <Load><p>Error al cargar</p></Load>

  type SavedItem =
    | { type: 'post'; data: PostQueryProps }
    | { type: 'comment'; data: CommentProps }

  const allItems: SavedItem[] = [
    ...(data?.getSavedPosts ?? []).map(p => ({ type: 'post' as const, data: p })),
    ...(commentData?.getSavedComment ?? []).map(c => ({ type: 'comment' as const, data: c })),
  ].sort((a, b) =>
    new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime()
  );
  let countItems = allItems.length;
  return (
  <Container>
    <Header>
      <HeaderTitle>Saved {countItems > 1 ? 'Items' : 'Item'}</HeaderTitle>
      <HeaderSubtitle>{countItems > 1? `${countItems} items` : `${countItems} item`}</HeaderSubtitle>
    </Header>
    {allItems.length === 0 ? (
      <Empty>
        <EmptyIcon>
          <BsBookmark size={40} color="#7e7d7dc1" />
        </EmptyIcon>
        <EmptyText>You haven't saved any items yet.</EmptyText>
      </Empty>
    ) : (
      allItems.map((item) => (
        item.type === 'post' ? (
          <PostWrapper key={item.data.id}>
            <Avatar avatarUrl={item.data.user_id.avatar} />
            <PostContent data={item.data} />
          </PostWrapper>
        ) : (
          <Comment key={item.data.id} comment={item.data} />
        )
      ))
    )}
  </Container>
);
}

const Load = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
`;
const Header = styled.div`
  padding: 20px 16px 12px;
  border-bottom: 1px solid rgba(119, 117, 117, 0.31);
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 13px;
  color: rgba(113, 118, 123, 1);
  margin: 2px 0 0;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
`;

const EmptyIcon = styled.span`
  font-size: 40px;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #7e7d7dc1;
  margin: 0;
`;

const PostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 4px 12px;
  border-bottom: 1px solid rgba(119, 117, 117, 0.31);
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  & > *:last-child {
    flex: 1;
    min-width: 0;
  }
`;

const Container = styled.section`
  width: 100%;
  max-width: 600px; 
  min-width: 0;
`;