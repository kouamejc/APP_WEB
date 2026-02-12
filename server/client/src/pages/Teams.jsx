import React, { useEffect, useMemo, useState } from 'react';
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

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const roleLabels = {
  chef_projet: 'Chef de projet / Manager',
  collaborateur: "Membre / Collaborateur",
  administrateur: 'Administrateur',
  client: 'Client / Partie prenante',
  observateur: 'Observateur / Auditeur',
  responsable: 'Responsable',
  membre: 'Membre'
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('collaborateur');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('app_teams') || '[]');
      if (Array.isArray(stored)) {
        setTeams(stored);
        if (stored.length > 0) {
          setSelectedTeamId(stored[0].id);
        }
      }
    } catch (error) {
      setTeams([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_teams', JSON.stringify(teams));
  }, [teams]);

  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTeamId) || null,
    [teams, selectedTeamId]
  );

  const handleCreateTeam = (event) => {
    event.preventDefault();
    if (!teamName.trim()) return;
    const next = {
      id: createId(),
      name: teamName.trim(),
      description: teamDescription.trim(),
      members: []
    };
    setTeams((prev) => [next, ...prev]);
    setSelectedTeamId(next.id);
    setTeamName('');
    setTeamDescription('');
  };

  const handleAddMember = (event) => {
    event.preventDefault();
    if (!memberName.trim() || !selectedTeam) return;
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== selectedTeam.id) return team;
        return {
          ...team,
          members: [
            ...team.members,
            { id: createId(), name: memberName.trim(), role: memberRole }
          ]
        };
      })
    );
    setMemberName('');
    setMemberRole('collaborateur');
  };

  const handleDeleteTeam = (teamId) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    if (teamId === selectedTeamId) {
      const next = teams.find((team) => team.id !== teamId);
      setSelectedTeamId(next ? next.id : '');
    }
  };

  const handleRemoveMember = (memberId) => {
    if (!selectedTeam) return;
    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== selectedTeam.id) return team;
        return {
          ...team,
          members: team.members.filter((member) => member.id !== memberId)
        };
      })
    );
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Equipes</PageTitle>
          <SubtleText>Gestion des equipes et des membres.</SubtleText>
        </div>
      </PageHeader>
      <Card as="form" onSubmit={handleCreateTeam}>
        <PageTitle style={{ margin: 0, fontSize: '1.2rem' }}>
          Creer une equipe
        </PageTitle>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <FieldGroup>
            <label>Nom de l'equipe</label>
            <Input
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Ex: Equipe Produit"
            />
          </FieldGroup>
          <FieldGroup>
            <label>Description</label>
            <Input
              value={teamDescription}
              onChange={(event) => setTeamDescription(event.target.value)}
              placeholder="Mission, perimetre..."
            />
          </FieldGroup>
          <PrimaryButton type="submit">Creer l'equipe</PrimaryButton>
        </div>
      </Card>

      <Card>
        <PageTitle style={{ margin: 0, fontSize: '1.2rem' }}>
          Membres et roles
        </PageTitle>
        {teams.length === 0 ? (
          <EmptyState style={{ marginTop: '1rem' }}>
            Aucune equipe. Creez-en une pour commencer.
          </EmptyState>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <FieldGroup>
              <label>Equipe</label>
              <Select
                value={selectedTeamId}
                onChange={(event) => setSelectedTeamId(event.target.value)}
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </FieldGroup>

            <form onSubmit={handleAddMember} style={{ display: 'grid', gap: '0.75rem' }}>
              <FieldGroup>
                <label>Nom du membre</label>
                <Input
                  value={memberName}
                  onChange={(event) => setMemberName(event.target.value)}
                  placeholder="Nom complet"
                />
              </FieldGroup>
              <FieldGroup>
                <label>Role</label>
                <Select
                  value={memberRole}
                  onChange={(event) => setMemberRole(event.target.value)}
                >
                  <option value="chef_projet">Chef de projet / Manager</option>
                  <option value="collaborateur">Membre / Collaborateur</option>
                  <option value="administrateur">Administrateur</option>
                  <option value="client">Client / Partie prenante</option>
                  <option value="observateur">Observateur / Auditeur</option>
                  <option value="responsable">Responsable</option>
                </Select>
              </FieldGroup>
              <PrimaryButton type="submit">Ajouter le membre</PrimaryButton>
            </form>

            {selectedTeam && (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {selectedTeam.members.length === 0 ? (
                  <SubtleText>Aucun membre dans cette equipe.</SubtleText>
                ) : (
                  selectedTeam.members.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '12px',
                        border: '1px solid #e6e0d6',
                        background: '#ffffff'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                        <SubtleText>Role: {roleLabels[member.role] || member.role}</SubtleText>
                      </div>
                      <GhostButton type="button" onClick={() => handleRemoveMember(member.id)}>
                        Retirer
                      </GhostButton>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {teams.length > 0 && (
        <Card>
          <PageTitle style={{ margin: 0, fontSize: '1.1rem' }}>
            Gestion rapide
          </PageTitle>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {teams.map((team) => (
              <div
                key={team.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '12px',
                  border: '1px solid #e6e0d6',
                  background: '#ffffff'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{team.name}</div>
                  <SubtleText>{team.description || 'Sans description.'}</SubtleText>
                </div>
                <GhostButton type="button" onClick={() => handleDeleteTeam(team.id)}>
                  Supprimer
                </GhostButton>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageWrap>
  );
}
