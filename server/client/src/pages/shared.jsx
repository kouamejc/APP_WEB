import styled, { keyframes } from 'styled-components';

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-family: 'Fraunces', 'Sora', serif;
  letter-spacing: -0.02em;
  margin: 0;
`;

export const SubtleText = styled.p`
  margin: 0.25rem 0 0;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.98rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
`;

export const Card = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), #ffffff);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 18px;
  padding: 1.35rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(6px);
  transition: transform 200ms ease, box-shadow 200ms ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 55px rgba(15, 23, 42, 0.12);
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const Input = styled.input.attrs({ required: true })`
  padding: 0.8rem 0.95rem;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.inputBackground};
  font-size: 0.95rem;
  outline: none;
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
  }
`;

export const Select = styled.select.attrs({ required: true })`
  padding: 0.8rem 0.95rem;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.border};
  font-size: 0.95rem;
  outline: none;
  background: ${(props) => props.theme.colors.inputBackground};
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
  }
`;

export const Textarea = styled.textarea.attrs({ required: true })`
  padding: 0.8rem 0.95rem;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.border};
  font-size: 0.95rem;
  min-height: 120px;
  resize: vertical;
  outline: none;
  background: ${(props) => props.theme.colors.inputBackground};
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
  }
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, #14b8a6 100%);
  color: #ffffff;
  border: none;
  padding: 0.8rem 1.3rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(15, 118, 110, 0.25);
  transition: transform 160ms ease, box-shadow 160ms ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 36px rgba(15, 118, 110, 0.3);
  }
`;

export const GhostButton = styled.button`
  background: ${(props) => props.theme.colors.surfaceAlt};
  color: ${(props) => props.theme.colors.textSecondary};
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: 0.6rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: ${(props) => props.$bg || '#eef2f0'};
  color: ${(props) => props.$color || '#0f172a'};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  background: #e9e2d8;
  border-radius: 999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.$value || 0}%;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, #14b8a6 100%);
  border-radius: 999px;
`;

export const EmptyState = styled.div`
  padding: 1.1rem;
  border: 1px dashed #d8d2c8;
  border-radius: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
  background: ${(props) => props.theme.colors.surfaceAlt};
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: ${fadeIn} 180ms ease-out;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: min(520px, 92vw);
  padding: 1.6rem;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.2);
  animation: ${popIn} 200ms ease-out;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ModalTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-family: 'Fraunces', 'Sora', serif;
`;

export const ModalBody = styled.p`
  margin: 0 0 1.25rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

export const DangerButton = styled.button`
  background: #fff1f2;
  color: #b42318;
  border: 1px solid #fecdd3;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
`;
