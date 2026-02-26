import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/AppStore';
import {
  PageWrap,
  PageHeader,
  PageTitle,
  SubtleText,
  Card,
  FieldGroup,
  Input,
  Select,
  PrimaryButton,
  GhostButton,
  EmptyState
} from './shared';

export default function Teams() {
  const { users, addUser, updateUser, deleteUser } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('collaborateur');

  const handleAddMember = (event) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !city.trim()) {
      return;
    }
    addUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      role
    });
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCity('');
    setRole('collaborateur');
  };

  const sortedUsers = useMemo(() => {
    const list = [...users];
    list.sort((a, b) => `${a.lastName || ''}`.localeCompare(`${b.lastName || ''}`));
    return list;
  }, [users]);

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Membres</PageTitle>
          <SubtleText>Gerer les utilisateurs de l'application.</SubtleText>
        </div>
      </PageHeader>

      <Card as="form" onSubmit={handleAddMember}>
        <PageTitle style={{ margin: 0, fontSize: '1.2rem' }}>
          Ajouter un membre
        </PageTitle>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <FieldGroup>
            <label>Prenom</label>
            <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Ex: Marie" />
          </FieldGroup>
          <FieldGroup>
            <label>Nom</label>
            <Input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Ex: Kone" />
          </FieldGroup>
          <FieldGroup>
            <label>Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="exemple@email.com" />
          </FieldGroup>
          <FieldGroup>
            <label>Telephone</label>
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0700000000" />
          </FieldGroup>
          <FieldGroup>
            <label>Ville</label>
            <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Abidjan" />
          </FieldGroup>
          <FieldGroup>
            <label>Role</label>
            <Select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="chef_projet">Chef de projet / Manager</option>
              <option value="collaborateur">Membre / Collaborateur</option>
              <option value="administrateur">Administrateur</option>
              <option value="client">Client / Partie prenante</option>
              <option value="observateur">Observateur / Auditeur</option>
              <option value="responsable">Responsable</option>
            </Select>
          </FieldGroup>
          <PrimaryButton type="submit">Ajouter le membre</PrimaryButton>
        </div>
      </Card>

      <Card>
        <PageTitle style={{ margin: 0, fontSize: '1.2rem' }}>
          Utilisateurs
        </PageTitle>
        {sortedUsers.length === 0 ? (
          <EmptyState style={{ marginTop: '1rem' }}>
            Aucun utilisateur pour le moment.
          </EmptyState>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {sortedUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '12px',
                  border: '1px solid #e6e0d6',
                  background: '#ffffff',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <SubtleText>{user.email}</SubtleText>
                  <SubtleText>{user.phone} · {user.city}</SubtleText>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Select
                    value={user.role || 'collaborateur'}
                    onChange={(event) =>
                      updateUser(user.id, { role: event.target.value })
                    }
                  >
                    <option value="chef_projet">Chef de projet / Manager</option>
                    <option value="collaborateur">Membre / Collaborateur</option>
                    <option value="administrateur">Administrateur</option>
                    <option value="client">Client / Partie prenante</option>
                    <option value="observateur">Observateur / Auditeur</option>
                    <option value="responsable">Responsable</option>
                  </Select>
                  <GhostButton type="button" onClick={() => deleteUser(user.id)}>
                    Supprimer
                  </GhostButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageWrap>
  );
}
