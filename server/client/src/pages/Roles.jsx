import React from "react";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  SubtleText,
  Card,
  Grid,
  Tag,
} from "./shared";

const roles = [
  {
    id: "chef_projet",
    title: "Chef de projet / Manager",
    tag: { label: "Pilotage", bg: "#e6f4f1", color: "#0f766e" },
    responsibilities: [
      "Cree et gere les projets",
      "Attribue et supervise les taches",
      "Consulte les rapports d'avancement",
      "Organise les equipes",
      "Planifie via le calendrier",
      "Pilote via le tableau de bord global",
    ],
  },
  {
    id: "collaborateur",
    title: "Membre de l'equipe / Collaborateur",
    tag: { label: "Execution", bg: "#fef3c7", color: "#92400e" },
    responsibilities: [
      "Consulte ses taches assignees",
      "Met a jour le statut des taches",
      "Participe aux discussions",
      "Recoit et consulte les notifications",
      "Visualise le calendrier de ses activites",
      "Accede a son tableau de bord personnel",
    ],
  },
  {
    id: "administrateur",
    title: "Administrateur",
    tag: { label: "Gouvernance", bg: "#e0e7ff", color: "#3730a3" },
    responsibilities: [
      "Gere les equipes (creation, modification, suppression)",
      "Configure les droits d'acces aux projets",
      "Supervise l'ensemble des activites",
      "Genere des rapports globaux",
      "Administre les notifications systeme",
    ],
  },
  {
    id: "client",
    title: "Client / Partie prenante externe",
    tag: { label: "Lecture seule", bg: "#f1f5f9", color: "#475569" },
    responsibilities: [
      "Consulte l'avancement des projets (lecture seule)",
      "Accede aux rapports qui le concernent",
      "Participe a certaines discussions specifiques",
    ],
  },
  {
    id: "observateur",
    title: "Observateur / Auditeur",
    tag: { label: "Controle", bg: "#fee2e2", color: "#b91c1c" },
    responsibilities: [
      "Visualise les rapports",
      "Consulte le tableau de bord sans pouvoir modifier",
    ],
  },
];

export default function Roles() {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Roles et responsabilites</PageTitle>
          <SubtleText>
            Definition des profils utilisateurs et de leurs droits d'action.
          </SubtleText>
        </div>
      </PageHeader>
      <Grid>
        {roles.map((role) => (
          <Card key={role.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <PageTitle style={{ margin: 0, fontSize: "1.2rem" }}>
                {role.title}
              </PageTitle>
              <Tag $bg={role.tag.bg} $color={role.tag.color}>
                {role.tag.label}
              </Tag>
            </div>
            <ul style={{ margin: "0.85rem 0 0", paddingLeft: "1.1rem", color: "#5b6460" }}>
              {role.responsibilities.map((item) => (
                <li key={item} style={{ marginBottom: "0.35rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </Grid>
    </PageWrap>
  );
}
