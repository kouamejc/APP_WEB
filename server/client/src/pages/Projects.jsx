import React, { useState } from "react";
import { useAppStore } from "../store/AppStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  SubtleText,
  Grid,
  Card,
  FieldGroup,
  Input,
  Textarea,
  PrimaryButton,
  GhostButton,
  ModalOverlay,
  ModalCard,
  ModalTitle,
  ModalBody,
  ModalActions,
  DangerButton,
  ProgressTrack,
  ProgressFill,
  EmptyState,
} from "./shared";

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, getProjectProgress } =
    useAppStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmProject, setConfirmProject] = useState(null);
  const currentRole = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("app_user") || "null");
      if (!user) return "collaborateur";
      const raw = `${user.role || user.roles || user.profil || ""}`.toLowerCase();
      if (!raw) return "collaborateur";
      if (raw === "admin") return "administrateur";
      return raw;
    } catch (error) {
      return "collaborateur";
    }
  })();
  const isAdmin = currentRole === "administrateur";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    addProject({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description || "");
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = (projectId) => {
    if (!editName.trim()) return;
    updateProject(projectId, {
      name: editName.trim(),
      description: editDescription.trim(),
    });
    cancelEdit();
  };

  const handleDelete = (projectId) => {
    const target = projects.find((project) => project.id === projectId);
    if (!target) return;
    setConfirmProject(target);
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Projets</PageTitle>
          <SubtleText>Creer et suivre vos projets.</SubtleText>
        </div>
      </PageHeader>

      {isAdmin && (
        <Card as="form" onSubmit={handleSubmit}>
          <PageTitle>Nouveau projet</PageTitle>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <FieldGroup>
              <label>Nom du projet</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Refonte site"
              />
            </FieldGroup>
            <FieldGroup>
              <label>Description</label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Objectif, equipe, livrables..."
              />
            </FieldGroup>
            <PrimaryButton type="submit">Creer le projet</PrimaryButton>
          </div>
        </Card>
      )}

      <Grid>
        {projects.length === 0 ? (
          <EmptyState>
            Aucun projet. Utilisez le formulaire pour en creer un.
          </EmptyState>
        ) : (
          projects.map((project) => {
            const progress = getProjectProgress(project.id);
            return (
              <Card key={project.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <PageTitle>{project.name}</PageTitle>
                    <SubtleText>
                      {project.description || "Sans description."}
                    </SubtleText>
                  </div>
                  {isAdmin && (
                    <div
                      style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                    >
                      <GhostButton
                        type="button"
                        onClick={() => startEdit(project)}
                      >
                        Modifier
                      </GhostButton>
                      <GhostButton
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        style={{
                          color: "#b91c1c",
                          borderColor: "#fecaca",
                          background: "#fef2f2",
                        }}
                      >
                        Supprimer
                      </GhostButton>
                    </div>
                  )}
                </div>

                {isAdmin && editingId === project.id && (
                  <div
                    style={{
                      display: "grid",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <FieldGroup>
                      <label>Nom du projet</label>
                      <Input
                        value={editName}
                        onChange={(event) =>
                          setEditName(event.target.value)
                        }
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <label>Description</label>
                      <Textarea
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                      />
                    </FieldGroup>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <PrimaryButton
                        type="button"
                        onClick={() => saveEdit(project.id)}
                      >
                        Enregistrer
                      </PrimaryButton>
                      <GhostButton type="button" onClick={cancelEdit}>
                        Annuler
                      </GhostButton>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "1rem" }}>
                  <SubtleText>Avancement</SubtleText>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span>{progress}%</span>
                  </div>
                  <ProgressTrack>
                    <ProgressFill $value={progress} />
                  </ProgressTrack>
                </div>
              </Card>
            );
          })
        )}
      </Grid>

      <AnimatePresence>
        {confirmProject && (
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
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ModalTitle>Supprimer le projet</ModalTitle>
              <ModalBody>
                Voulez-vous vraiment supprimer "{confirmProject.name}" ? Les
                taches associees seront supprimees.
              </ModalBody>
              <ModalActions>
                <GhostButton
                  type="button"
                  onClick={() => setConfirmProject(null)}
                >
                  Annuler
                </GhostButton>
                <DangerButton
                  type="button"
                  onClick={() => {
                    deleteProject(confirmProject.id);
                    setConfirmProject(null);
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
