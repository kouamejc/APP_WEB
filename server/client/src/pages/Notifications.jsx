import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/AppStore";
import {
    PageWrap,
    PageHeader,
    PageTitle,
    SubtleText,
    Card,
    Tag,
    GhostButton,
    FieldGroup,
    Input,
    Textarea,
    Select,
    PrimaryButton,
    EmptyState,
} from "./shared";

const typeColor = {
    info: { bg: "#bfdbfe", color: "#1d4ed8" },
    success: { bg: "#bbf7d0", color: "#166534" },
    warning: { bg: "#fed7aa", color: "#9a3412" },
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleString("fr-FR");
};

export default function Notifications() {
    const { notifications, markNotificationRead, markAllNotificationsRead, addNotification } =
        useAppStore();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [type, setType] = useState("info");
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

    useEffect(() => {
        if (notifications.length === 0) return;
        const hasUnread = notifications.some((notification) => !notification.read);
        if (hasUnread) {
            markAllNotificationsRead();
        }
    }, [notifications, markAllNotificationsRead]);

    const handleCreate = (event) => {
        event.preventDefault();
        if (!title.trim()) return;
        addNotification({
            title: title.trim(),
            body: body.trim(),
            type,
        });
        setTitle("");
        setBody("");
        setType("info");
    };

    return (
        <PageWrap>
            <PageHeader>
                <div>
                    <PageTitle>Notifications</PageTitle>
                    <SubtleText>Suivez les alertes et mises a jour.</SubtleText>
                </div>
                {notifications.length > 0 && (
                    <GhostButton type="button" onClick={markAllNotificationsRead}>
                        Tout marquer comme lu
                    </GhostButton>
                )}
            </PageHeader>

            {isAdmin && (
                <Card as="form" onSubmit={handleCreate}>
                    <PageTitle>Nouvelle notification globale</PageTitle>
                    <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                        <FieldGroup>
                            <label>Titre</label>
                            <Input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Ex: Maintenance planifiee"
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label>Message</label>
                            <Textarea
                                value={body}
                                onChange={(event) => setBody(event.target.value)}
                                placeholder="Details de la notification..."
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <label>Type</label>
                            <Select
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                            >
                                <option value="info">Info</option>
                                <option value="success">Succes</option>
                                <option value="warning">Alerte</option>
                            </Select>
                        </FieldGroup>
                        <PrimaryButton type="submit">Envoyer</PrimaryButton>
                    </div>
                </Card>
            )}

            {notifications.length === 0 ? (
                <EmptyState>Aucune notification pour le moment.</EmptyState>
            ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                    {notifications.map((notification) => {
                        const palette = typeColor[notification.type] || typeColor.info;
                        return (
                            <Card key={notification.id}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                    }}
                                >
                                    <div>
                                        <PageTitle>{notification.title}</PageTitle>
                                        <SubtleText>{notification.body}</SubtleText>
                                        <SubtleText>{formatDate(notification.createdAt)}</SubtleText>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.5rem",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        <Tag $bg={palette.bg} $color={palette.color}>
                                            {notification.type}
                                        </Tag>
                                        <GhostButton
                                            type="button"
                                            onClick={() =>
                                                markNotificationRead(
                                                    notification.id,
                                                    !notification.read,
                                                )
                                            }
                                        >
                                            {notification.read ? "Marquer non lu" : "Marquer lu"}
                                        </GhostButton>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </PageWrap>
    );
}
