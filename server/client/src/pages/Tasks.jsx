import React, { useState } from 'react';
import { useAppStore } from '../store/AppStore';
import { AnimatePresence, motion } from 'framer-motion';
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
  ModalOverlay,
  ModalCard,
  ModalTitle,
  ModalBody,
  ModalActions,
  DangerButton,
  Tag,
  EmptyState
} from './shared';

const statusLabel = {
  todo: 'A faire',
  in_progress: 'En cours',
  done: 'Terminee'
};

const statusColor = {
  todo: { bg: '#e2e8f0', color: '#0f172a' },
  in_progress: { bg: '#fde68a', color: '#92400e' },
  done: { bg: '#bbf7d0', color: '#166534' }
};

export default function Tasks() {
  const { tasks, projects, addTask, updateTaskStatus, updateTask, deleteTask } = useAppStore();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [confirmTask, setConfirmTask] = useState(null);
  const currentRole = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('app_user') || 'null');
      if (!user) return 'collaborateur';
      const raw = `${user.role || user.roles || user.profil || ''}`.toLowerCase();
      if (!raw) return 'collaborateur';
      if (raw === 'admin') return 'administrateur';
      return raw;
    } catch (error) {
      return 'collaborateur';
    }
  })();
  const isAdmin = currentRole === 'administrateur';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), projectId, status: 'todo', dueDate });
    setTitle('');
    setProjectId('');
    setDueDate('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditProjectId(task.projectId || '');
    setEditDueDate(task.dueDate || '');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditTitle('');
    setEditProjectId('');
    setEditDueDate('');
  };

  const saveEdit = (taskId) => {
    if (!editTitle.trim()) return;
    updateTask(taskId, {
      title: editTitle.trim(),
      projectId: editProjectId,
      dueDate: editDueDate
    });
    cancelEdit();
  };

  const handleDelete = (taskId) => {
    const target = tasks.find((task) => task.id === taskId);
    if (!target) return;
    setConfirmTask(target);
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Taches</PageTitle>
          <SubtleText>Creer, assigner et suivre vos taches.</SubtleText>
        </div>
      </PageHeader>

      {isAdmin && (
        <Card as="form" onSubmit={handleSubmit}>
          <PageTitle>Nouvelle tache</PageTitle>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <FieldGroup>
              <label>Titre</label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Definir le scope" />
            </FieldGroup>
            <FieldGroup>
              <label>Projet associe</label>
              <Select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                <option value="">Sans projet</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup>
              <label>Echeance</label>
              <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            </FieldGroup>
            <PrimaryButton type="submit">Creer la tache</PrimaryButton>
          </div>
        </Card>
      )}

      {tasks.length === 0 ? (
        <EmptyState>Aucune tache. Ajoutez-en une pour demarrer.</EmptyState>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => {
            const projectName = projects.find((project) => project.id === task.projectId)?.name || 'Sans projet';
            const palette = statusColor[task.status] || statusColor.todo;
            return (
              <Card key={task.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <PageTitle>{task.title}</PageTitle>
                    <SubtleText>Projet: {projectName}</SubtleText>
                    <SubtleText>Echeance: {task.dueDate || '-'}</SubtleText>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <Tag $bg={palette.bg} $color={palette.color}>
                      {statusLabel[task.status] || 'A faire'}
                    </Tag>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <GhostButton type="button" onClick={() => startEdit(task)}>
                          Modifier
                        </GhostButton>
                        <GhostButton
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          style={{ color: '#b91c1c', borderColor: '#fecaca', background: '#fef2f2' }}
                        >
                          Supprimer
                        </GhostButton>
                      </div>
                    )}
                  </div>
                </div>
                {isAdmin ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <SubtleText>Mettre a jour le statut</SubtleText>
                    <Select
                      value={task.status}
                      onChange={(event) => updateTaskStatus(task.id, event.target.value)}
                    >
                      <option value="todo">A faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="done">Terminee</option>
                    </Select>
                  </div>
                ) : null}
                {isAdmin && editingId === task.id ? (
                  <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                    <FieldGroup>
                      <label>Titre</label>
                      <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                    </FieldGroup>
                    <FieldGroup>
                      <label>Projet associe</label>
                      <Select value={editProjectId} onChange={(event) => setEditProjectId(event.target.value)}>
                        <option value="">Sans projet</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </Select>
                    </FieldGroup>
                    <FieldGroup>
                      <label>Echeance</label>
                      <Input type="date" value={editDueDate} onChange={(event) => setEditDueDate(event.target.value)} />
                    </FieldGroup>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <PrimaryButton type="button" onClick={() => saveEdit(task.id)}>
                        Enregistrer
                      </PrimaryButton>
                      <GhostButton type="button" onClick={cancelEdit}>
                        Annuler
                      </GhostButton>
                    </div>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {confirmTask && (
          <ModalOverlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalCard
              as={motion.div}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ModalTitle>Supprimer la tache</ModalTitle>
              <ModalBody>Voulez-vous vraiment supprimer "{confirmTask.title}" ?</ModalBody>
              <ModalActions>
                <GhostButton type="button" onClick={() => setConfirmTask(null)}>
                  Annuler
                </GhostButton>
                <DangerButton
                  type="button"
                  onClick={() => {
                    deleteTask(confirmTask.id);
                    setConfirmTask(null);
                  }}
                >
                  Supprimer
                </DangerButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}
