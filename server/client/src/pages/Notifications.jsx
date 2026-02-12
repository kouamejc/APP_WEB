import React, { useEffect } from "react";
import { useAppStore } from "../store/AppStore";
import {
    PageWrap,
    PageHeader,
    PageTitle,
    SubtleText,
    Card,
    Tag,
    GhostButton,
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
    const { notifications, markNotificationRead, markAllNotificationsRead } =
        useAppStore();

    useEffect(() => {
        if (notifications.length === 0) return;
        const hasUnread = notifications.some((notification) => !notification.read);
        if (hasUnread) {
            markAllNotificationsRead();
        }
    }, [notifications, markAllNotificationsRead]);

    return ( <
        PageWrap >
        <
        PageHeader >
        <
        div >
        <
        PageTitle > Notifications < /PageTitle> <
        SubtleText > Suivez les alertes et mises a jour. < /SubtleText> <
        /div> {
            notifications.length > 0 && ( <
                GhostButton type = "button"
                onClick = { markAllNotificationsRead } >
                Tout marquer comme lu <
                /GhostButton>
            )
        } <
        /PageHeader> {
            notifications.length === 0 ? ( <
                EmptyState > Aucune notification pour le moment. < /EmptyState>
            ) : ( <
                div style = {
                    { display: "grid", gap: "1rem" } } > {
                    notifications.map((notification) => {
                        const palette = typeColor[notification.type] || typeColor.info;
                        return ( <
                            Card key = { notification.id } >
                            <
                            div style = {
                                {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "1rem",
                                }
                            } >
                            <
                            div >
                            <
                            PageTitle > { notification.title } < /PageTitle> <
                            SubtleText > { notification.body } < /SubtleText> <
                            SubtleText > { formatDate(notification.createdAt) } <
                            /SubtleText> <
                            /div> <
                            div style = {
                                {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    alignItems: "flex-end",
                                }
                            } >
                            <
                            Tag $bg = { palette.bg }
                            $color = { palette.color } > { notification.type } <
                            /Tag> <
                            GhostButton type = "button"
                            onClick = {
                                () =>
                                markNotificationRead(
                                    notification.id, !notification.read,
                                )
                            } >
                            { notification.read ? "Marquer lu" : "Marquer non lu" } <
                            /GhostButton> <
                            /div> <
                            /div> <
                            /Card>
                        );
                    })
                } <
                /div>
            )
        } <
        /PageWrap>
    );
}
