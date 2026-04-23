import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(91, 112, 131, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalCard = styled.div`
  background: #0e1217;
  border-radius: 24px;
  padding: 50px;
  width: 100%;
  margin-top: 80px;
  max-width: 550px;
  max-height: calc(100vh - 220px);
  min-height: calc(100vh - 300px);
  overflow-y: auto;
  position: relative;
  animation: ${slideUp} 0.25s ease;

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #0e1217;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: background 0.2s;

  &:hover {
    background: #3d3d3d88;
  }
`;

export const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

export const WelcomeText = styled.p`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
`;

export const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #fff;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1; 
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #7d8da2;
  letter-spacing: 0.3px;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 13px 14px 13px 44px;
  font-size: 15px;
  color: #fff;
  background: #0e1217;
  border-radius: 12px;
  transition: border-color 0.2s;
  letter-spacing: 0.3px;
  border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#9cb3d158")};

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? "#ef4444" : "#3b82f6")};
  }
  &:hover:not(:focus) {
    border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#9cb3d176")};
  }

  &::placeholder {
    color: #8696acff;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #407ddf 0%, #7453d6 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;  
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover {
    transform: translateY(-2px);
  }
  &:hover::before {
    opacity: 1;
  }
  &:active {
    transform: translateY(0);
  }
`;

export const FooterText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #8696ac;
  font-weight: 500;
  margin-top: 4px;
`;

export const LoginLink = styled.span`
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export const BirthLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #8696acff;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
`;

export const SelectRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const ComboWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const ComboBox = styled.div<{ $open: boolean, $error?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border: 1px solid ${({ $open, $error }) =>
    $open ? "#1877f2" : $error ? "#ef4444" : "#9cb3d158"};
  border-radius: 8px;
  background: ${({ $open }) => ($open ? "#0e1217" : "#0e1217")};
  cursor: pointer;
  user-select: none;
  transition: border-color 0.18s, background 0.18s;
  min-height: 42px;

  &:hover {
    border-color: ${({ $open, $error }) =>
    $open ? "#1877f2" : $error ? "#ef4444" : "#9cb3d176"};
  }
`;

export const ComboLabel = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  color: ${({ $selected }) => ($selected ? "#fff" : "#8a8d91")};
  font-weight: ${({ $selected }) => ($selected ? "500" : "400")};
  flex: 1;
`;

export const ChevronIcon = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  color: #606770;
  margin-left: 6px;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const Listbox = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #0e1217;
  border: 1px solid #73777c5a;
  border-radius: 8px;
  max-height: 115px;
  overflow-y: auto;
  z-index: 1000;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  display: ${({ $open }) => ($open ? "block" : "none")};

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #ccd0d5; border-radius: 3px; }
`;

export const ListItem = styled.li<{ $active: boolean }>`
  padding: 9px 14px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 4px;
  background: ${({ $active }) => ($active ? "#000" : "transparent")};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? "#1877f2" : "#fff")};
  transition: background 0.12s;
`;

export const ErrorMsg = styled.span`
  font-size: 11px;
  color: #ef4444;
  font-weight: 500;
  margin-top: -2px;
`;

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  color: #fff;
  text-align: center;
`;

export const SuccessText = styled.p`
  font-size: 15px;
  color: #64748b;
  letter-spacing: 0.3px;
  line-height: 1.5;
`;

export const CloseBtn = styled.button`
  margin-top: 8px;
  padding: 13px 32px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #407ddf 0%, #7453d6 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;