import React from "react";
import { useAppStore } from "../store/AppStore";
import {
    PageWrap,
    PageHeader,
    PageTitle,
    SubtleText,
    Grid,
    Card,
    ProgressTrack,
    ProgressFill,
    EmptyState,
} from "./shared";

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleDateString("fr-FR");
};

export default function Dashboard() {
    const { projects, tasks, discussions, notifications, getProjectProgress } =
        useAppStore();
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const unread = notifications.filter(
        (notification) => !notification.read,
    ).length;

    return (
        <PageWrap>
            <PageHeader>
                <div>
                    <PageTitle style={{ fontWeight: 800 }}>Tableau de bord</PageTitle>
                    <SubtleText>
                        Vue d&apos;ensemble rapide de vos activites.
                    </SubtleText>
                </div>
            </PageHeader>

            <Grid>
                <Card>
                    <SubtleText>Projets actifs</SubtleText>
                    <PageTitle>{projects.length}</PageTitle>
                </Card>
                <Card>
                    <SubtleText>Taches totales</SubtleText>
                    <PageTitle>{tasks.length}</PageTitle>
                </Card>
                <Card>
                    <SubtleText>Taches terminees</SubtleText>
                    <PageTitle>{completedTasks}</PageTitle>
                </Card>
                <Card>
                    <SubtleText>Notifications non lues</SubtleText>
                    <PageTitle>{unread}</PageTitle>
                </Card>
            </Grid>

            <Card>
                <PageHeader>
                    <div>
                        <PageTitle>Indicateurs d&apos;avancement</PageTitle>
                        <SubtleText>Progression par projet.</SubtleText>
                    </div>
                </PageHeader>
                {projects.length === 0 ? (
                    <EmptyState>
                        Ajoutez un projet pour suivre la progression.
                    </EmptyState>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        {projects.map((project) => {
                            const progress = getProjectProgress(project.id);
                            return (
                                <div key={project.id}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "0.35rem",
                                        }}
                                    >
                                        <strong>{project.name}</strong>
                                        <span>{progress}%</span>
                                    </div>
                                    <ProgressTrack>
                                        <ProgressFill $value={progress} />
                                    </ProgressTrack>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            <Grid>
                <Card>
                    <PageTitle>Discussions recentes</PageTitle>
                    {discussions.length === 0 ? (
                        <EmptyState>
                            Aucune discussion pour le moment.
                        </EmptyState>
                    ) : (
                        discussions.slice(0, 3).map((discussion) => (
                            <div
                                key={discussion.id}
                                style={{ marginTop: "0.75rem" }}
                            >
                                <strong>{discussion.title}</strong>
                                <SubtleText>
                                    {discussion.messages.length} message(s) -{" "}
                                    {formatDate(discussion.createdAt)}
                                </SubtleText>
                            </div>
                        ))
                    )}
                </Card>
                <Card>
                    <PageTitle>Taches proches</PageTitle>
                    {tasks.length === 0 ? (
                        <EmptyState>Aucune tache en cours.</EmptyState>
                    ) : (
                        tasks.slice(0, 4).map((task) => (
                            <div
                                key={task.id}
                                style={{ marginTop: "0.75rem" }}
                            >
                                <strong>{task.title}</strong>
                                <SubtleText>
                                    Statut: {task.status}{" "}
                                    {task.dueDate
                                        ? `- Echeance ${formatDate(
                                              task.dueDate,
                                          )}`
                                        : ""}
                                </SubtleText>
                            </div>
                        ))
                    )}
                </Card>
            </Grid>
        </PageWrap>
    );
}
