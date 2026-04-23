import styled from 'styled-components';
import { SlOptions } from "react-icons/sl";
import { ModalOption } from './modals/ModalOption';
import { PostActions } from './PostActions';
import type { PostQueryProps } from './types';
import { RepostCard } from './PostCardRepost';
import { PostFeedVideo } from './PostFeedVideo';
import { dayjs } from '@/utils';
import { usePostContent } from '@/hooks/post/usePostContent';
import { getDisplayName } from '@/utils/user/user';

interface Props {
  data: PostQueryProps;
}

export const PostContent = ({ data }: Props) => {
  const { handlePostDetails, isOpenOption,
    setIsOpenOption, theme } = usePostContent({ data });


  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpenOption(prev => !prev);
  };
  const handleUsername = data.user_id.email?.split("@")[0] ?? "anonymous";

  const handleClick = () => {
    handlePostDetails(data);
  }

  return (
    <Container onClick={handleClick}>
      <div>
        <Title>
          <SubTitle $theme={theme}>
            <H2 $theme={theme}>
              <strong>{getDisplayName(data.user_id.name)}</strong>
            </H2>
            <span>@{handleUsername} &middot; {dayjs(data.created_at).fromNow(true)}</span>
          </SubTitle>
          <Option onClick={toggleOptions}>
            <span>
              <SlOptions size={17} style={{
                color: !isOpenOption
                  ? theme === 'dark'
                    ? '#a8b3cf'
                    : 'rgba(83, 100, 113, 1)'
                  : '#1870f4'
              }} />
            </span>
            {isOpenOption &&
              <ModalOption
                setIsOpenOption={setIsOpenOption}
                post={data}
              />
            }
          </Option>
        </Title>
        <Content>{data.content}</Content>
      </div>
      <div>
        {data.media && (
          <ContainerMedia>
            {data.media.media_type === 'video' ? (
              <VideoWrapper>
                <PostFeedVideo
                  src={data.media.url}
                  theme={theme}
                />
              </VideoWrapper>
            ) : (
              <img
                src={data.media.url}
                alt="Post media"
                width={600}
                height={400}
              />
            )}
          </ContainerMedia>
        )}
      </div>

      {/* repost */}
      <RepostCard
        original_comment={data.original_comment}
        original_post={data.original_post}
      />
      {/* actions icons post */}
      <PostActions data={data} initialReaction={data.initialReaction} />
    </Container>
  )
}

const ContainerMedia = styled.div`
  width: 100%;
  margin: 12px 0px 7px 0px;
  border-radius: 16px;
  padding: 0px 5px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  aspect-ratio: 16/9;

  img {
    display: block;
    border-radius: 16px;
    min-width: 320px;
    max-width: 100%;
    max-height: 400px;
    height: auto;
    object-fit: cover; 
    background: transparent; 
  }

  @media (max-width: 768px) {
    img {
      max-height: 450px;
    }
  }

  @media (max-width: 480px) {
    img {
      max-height: 350px;
    }
  }
`;

const H2 = styled.h2<{ $theme: string }>`
  font-size: 15px;
  font-weight: 400;
  padding: 0px 5px;
  color: ${({ $theme }) => $theme === 'dark' ? '#fff' : '#000'}
`;

const Content = styled.p`
  width: 100%;
  padding: 0px 5px;
  font-family: Google Sans Text, Roboto, Arial, sans-serif;
  font-weight: 400;
  font-size: 15px;
  display: block;
  letter-spacing: 0.2px;
  word-wrap: break-word;
  text-aling: inherit;
     
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
  line-height: 20px;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
`;

const VideoWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16/9;  
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme === 'dark' ? '#000' : '#f0f0f0'};

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
`;

const Option = styled.div`
  margin: 4px 5px 0px 7px;
  cursor: pointer;
  position: relative;
  display: inline-block;
`;

const SubTitle = styled.div<{ $theme: string }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 14px;
    margin-left: 4px;
    color: ${({ $theme }) =>
  ($theme === 'dark'
    ? '#8698c4ff'
    : '#5f6b89ff')};
  }
`;

const Title = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
