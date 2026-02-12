import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  PageWrap,
  PageTitle,
  SubtleText,
  Card,
  FieldGroup,
  Input,
  PrimaryButton,
  GhostButton
} from './shared';

const AuthWrap = styled(PageWrap)`
  min-height: calc(100vh - 4rem);
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const AuthCard = styled(Card)`
  width: min(620px, 100%);
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
`;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '',
    prenoms: '',
    email: '',
    telephone: '',
    ville: ''
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.nom.trim() || !form.prenoms.trim() || !form.email.trim() || !form.telephone.trim() || !form.ville.trim()) {
      toast.error('Veuillez remplir tous les champs requis.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom.trim(),
          prenoms: form.prenoms.trim(),
          email: form.email.trim(),
          telephone: form.telephone.trim(),
          ville: form.ville.trim()
        })
      });
      if (!res.ok) {
        let message = 'Erreur inscription';
        try {
          const data = await res.json();
          message = data && data.error ? data.error : message;
        } catch (error) {
          const text = await res.text();
          if (text) message = text;
        }
        throw new Error(message);
      }
      const user = await res.json();
      localStorage.setItem('app_user', JSON.stringify(user));
      toast.success('Inscription reussie');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Impossible de creer le compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrap>
      <AuthCard as="form" onSubmit={handleSubmit}>
        <PageTitle>Inscription</PageTitle>
        <SubtleText>Renseignez vos informations pour creer un compte.</SubtleText>
        <FormGrid>
          <FieldGroup>
            <label>Nom</label>
            <Input value={form.nom} onChange={updateField('nom')} placeholder="Nom" />
          </FieldGroup>
          <FieldGroup>
            <label>Prenoms</label>
            <Input value={form.prenoms} onChange={updateField('prenoms')} placeholder="Prenoms" />
          </FieldGroup>
          <FieldGroup>
            <label>Email</label>
            <Input type="email" value={form.email} onChange={updateField('email')} placeholder="exemple@email.com" />
          </FieldGroup>
          <FieldGroup>
            <label>Numero de telephone</label>
            <Input value={form.telephone} onChange={updateField('telephone')} placeholder="07 00 00 00 00" />
          </FieldGroup>
          <FieldGroup>
            <label>Ville</label>
            <Input value={form.ville} onChange={updateField('ville')} placeholder="Abidjan" />
          </FieldGroup>
          <Actions>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Creation...' : 'Creer le compte'}
            </PrimaryButton>
            <GhostButton as={Link} to="/login" type="button">
              J'ai deja un compte
            </GhostButton>
          </Actions>
        </FormGrid>
      </AuthCard>
    </AuthWrap>
  );
}
