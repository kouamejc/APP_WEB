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
  Textarea,
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
  const {
    tasks,
    projects,
    users,
    discussions,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    addTaskComment
  } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [confirmTask, setConfirmTask] = useState(null);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [commentMap, setCommentMap] = useState({});
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('app_user') || 'null');
    } catch (error) {
      return null;
    }
  })();
  const currentUserId = currentUser?.id || '';
  const currentUserName = currentUser
    ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
    : '';
  const getUserNameById = (userId) => {
    if (!userId) return '';
    const user = users.find((item) => item.id === userId);
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    const selectedName = getUserNameById(assignedTo) || currentUserName;
    addTask({
      title: title.trim(),
      description: description.trim(),
      projectId,
      assignedTo: assignedTo || currentUserId,
      assignedToName: selectedName,
      status: 'todo',
      dueDate
    });
    setTitle('');
    setDescription('');
    setProjectId('');
    setAssignedTo('');
    setDueDate('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditProjectId(task.projectId || '');
    setEditAssignedTo(task.assignedTo || '');
    setEditDueDate(task.dueDate || '');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditTitle('');
    setEditDescription('');
    setEditProjectId('');
    setEditAssignedTo('');
    setEditDueDate('');
  };

  const saveEdit = (taskId) => {
    if (!editTitle.trim()) return;
    const selectedName = getUserNameById(editAssignedTo) || currentUserName;
    updateTask(taskId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      projectId: editProjectId,
      assignedTo: editAssignedTo || currentUserId,
      assignedToName: selectedName,
      dueDate: editDueDate
    });
    cancelEdit();
  };

  const handleDelete = (taskId) => {
    const target = tasks.find((task) => task.id === taskId);
    if (!target) return;
    setConfirmTask(target);
  };

  const filteredTasks = showMineOnly && currentUserId
    ? tasks.filter((task) => task.assignedTo === currentUserId)
    : tasks;
  const assigneeOptions = (() => {
    const list = [...users];
    if (currentUserId && !list.find((user) => user.id === currentUserId)) {
      list.unshift({
        id: currentUserId,
        firstName: currentUser?.firstName || 'Moi',
        lastName: currentUser?.lastName || ''
      });
    }
    return list;
  })();

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Taches</PageTitle>
          <SubtleText>Creer, assigner et suivre vos taches.</SubtleText>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <GhostButton
            type="button"
            onClick={() => setShowMineOnly((prev) => !prev)}
          >
            {showMineOnly ? 'Voir toutes les taches' : 'Voir mes taches'}
          </GhostButton>
        </div>
      </PageHeader>

      <Card as="form" onSubmit={handleSubmit}>
        <PageTitle>Nouvelle tache</PageTitle>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <FieldGroup>
            <label>Titre</label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Definir le scope" />
          </FieldGroup>
          <FieldGroup>
            <label>Description</label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Details de la tache..."
            />
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
            <label>Assignee</label>
            <Select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
              <option value="">{currentUserName || 'Moi'}</option>
              {assigneeOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.id}
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

      {filteredTasks.length === 0 ? (
        <EmptyState>Aucune tache. Ajoutez-en une pour demarrer.</EmptyState>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredTasks.map((task) => {
            const projectName = projects.find((project) => project.id === task.projectId)?.name || 'Sans projet';
            const palette = statusColor[task.status] || statusColor.todo;
            const assigneeName =
              task.assignedToName ||
              getUserNameById(task.assignedTo) ||
              (task.assignedTo === currentUserId ? currentUserName : '');
            const taskDiscussion = discussions.find((discussion) => discussion.taskId === task.id);
            const messageCount = taskDiscussion?.messages?.length || 0;
            return (
              <Card key={task.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <PageTitle>{task.title}</PageTitle>
                    {task.description ? <SubtleText>{task.description}</SubtleText> : null}
                    <SubtleText>Projet: {projectName}</SubtleText>
                    <SubtleText>Echeance: {task.dueDate || '-'}</SubtleText>
                    <SubtleText>Assignee: {assigneeName || 'Non assigne'}</SubtleText>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <Tag $bg={palette.bg} $color={palette.color}>
                      {statusLabel[task.status] || 'A faire'}
                    </Tag>
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
                  </div>
                </div>
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
                {editingId === task.id ? (
                  <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                    <FieldGroup>
                      <label>Titre</label>
                      <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                    </FieldGroup>
                    <FieldGroup>
                      <label>Description</label>
                      <Textarea
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                      />
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
                      <label>Assignee</label>
                      <Select value={editAssignedTo} onChange={(event) => setEditAssignedTo(event.target.value)}>
                        <option value="">{currentUserName || 'Moi'}</option>
                        {assigneeOptions.map((user) => (
                          <option key={user.id} value={user.id}>
                            {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.id}
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
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                  <SubtleText>
                    Commentaires: {messageCount}
                  </SubtleText>
                  {taskDiscussion?.messages?.slice(-2).map((messageItem) => (
                    <div
                      key={messageItem.id}
                      style={{
                        padding: '0.65rem',
                        background: '#f8fafc',
                        borderRadius: '10px'
                      }}
                    >
                      <strong>{messageItem.author}</strong>
                      <SubtleText>{messageItem.body}</SubtleText>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Input
                      value={commentMap[task.id] || ''}
                      onChange={(event) =>
                        setCommentMap((prev) => ({
                          ...prev,
                          [task.id]: event.target.value
                        }))
                      }
                      placeholder="Ajouter un commentaire..."
                    />
                    <GhostButton
                      type="button"
                      onClick={() => {
                        const message = commentMap[task.id];
                        if (!message || !message.trim()) return;
                        addTaskComment(task.id, message.trim());
                        setCommentMap((prev) => ({ ...prev, [task.id]: '' }));
                      }}
                    >
                      Envoyer
                    </GhostButton>
                  </div>
                </div>
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
