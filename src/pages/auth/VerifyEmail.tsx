import type React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { VscError } from "react-icons/vsc";
import { Spinner } from '@/components/ui';
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail';

type CardProps = {
  status: string;
  children: React.ReactNode;
}
const CardContent = ({ children, status }: CardProps) => {
  return (
    <Card $status={status}>
      { children }
    </Card>
  )
} 
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { status, message } = useVerifyEmail(token);

  return (
    <Container>
      {status === 'loading' && (
        <CardContent status={status}>
          <Spinner color={'#493aeeff'}/>
        </CardContent>
      )}
      {status === 'error' && (
        <CardContent status={status}>
          <VscError size={40}/>
          <Error>{message}</Error>
        </CardContent>
      )}
    </Container>
  );
}


const Container = styled.div`
  min-height: 100vh;
  background: #131420;
  display: flex;
  align-items: center;
  margin-top: 100px;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div<{ $status: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ $status }) =>
    $status === 'error'
      ? '#ef44441a'
      : 'transparent'
  };
  border-radius: 24px;
  padding: 15px;
  color: #ef4444;
  width: 100%;
  height: 250px;
  letter-spacing: 0.5px;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

const Error = styled.h3`
  font-size: 17px;
  letter-spacing: 0.5px;
  color: #ef4444cf;
  margin: 0;
  text-align: center;
`;