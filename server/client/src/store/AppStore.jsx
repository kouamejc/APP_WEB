import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { buildApiUrl } from "../utils/api";

const AppStoreContext = createContext(null);

const createId = () =>
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const emptyState = {
    projects: [],
    tasks: [],
    discussions: [],
    notifications: [],
};

export function AppStoreProvider({ children }) {
    const [data, setData] = useState(() => emptyState);

    const apiRequest = async (path, options = {}) => {
        const role = (() => {
            try {
                const user = JSON.parse(
                    localStorage.getItem("app_user") || "null",
                );
                if (!user) return "collaborateur";
                const raw = `${user.role || user.roles || user.profil || ""}`.toLowerCase();
                if (!raw) return "collaborateur";
                if (raw === "admin") return "administrateur";
                return raw;
            } catch (error) {
                return "collaborateur";
            }
        })();
        const res = await fetch(buildApiUrl(path), {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                "x-user-role": role,
                ...(options.headers || {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        if (!res.ok) {
            const message = await res.text();
            throw new Error(message || "Erreur API");
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    };

    useEffect(() => {
        let active = true;
        const load = async () => {
            const safeFetch = async (path) => {
                try {
                    const result = await apiRequest(path);
                    return Array.isArray(result) ? result : [];
                } catch (error) {
                    return [];
                }
            };
            const [projects, tasks, discussions, notifications] =
                await Promise.all([
                    safeFetch("/projects"),
                    safeFetch("/tasks"),
                    safeFetch("/discussions"),
                    safeFetch("/notifications"),
                ]);
            if (!active) return;
            setData({
                projects,
                tasks,
                discussions,
                notifications,
            });
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    const addNotification = async (payload, options = {}) => {
        try {
            const next = {
                id: createId(),
                title: payload.title,
                body: payload.body || "",
                type: payload.type || "info",
                createdAt: new Date().toISOString(),
                read: false,
            };
            const created = await apiRequest("/notifications", {
                method: "POST",
                body: next,
            });
            setData((prev) => ({
                ...prev,
                notifications: [created, ...prev.notifications],
            }));
            if (created && !options.silentToast) {
                const message = created.title || "Notification";
                if (created.type === "success") toast.success(message);
                else if (created.type === "warning") toast(message, { icon: "⚠️" });
                else toast(message);
            }
        } catch (error) {
            // ignore
        }
    };

    const addProject = async (payload) => {
        try {
            const next = {
                id: createId(),
                name: payload.name,
                description: payload.description || "",
                createdAt: new Date().toISOString(),
            };
            const created = await apiRequest("/projects", {
                method: "POST",
                body: next,
            });
            setData((prev) => ({
                ...prev,
                projects: [created, ...prev.projects],
            }));
            addNotification({
                title: "Nouveau projet",
                body: `Projet "${payload.name}" `,
                type: "success",
            }, { silentToast: true });
            toast.success("Projet créé");
        } catch (error) {
            toast.error("Impossible de créer le projet");
        }
    };

    const updateProject = async (projectId, updates) => {
        try {
            const currentProject = data.projects.find(
                (project) => project.id === projectId,
            );
            const projectName =
                (currentProject && currentProject.name) ||
                updates.name ||
                "Projet";
            const updated = await apiRequest(`/projects/${projectId}`, {
                method: "PUT",
                body: {
                    ...updates,
                    updatedAt: new Date().toISOString(),
                },
            });
            setData((prev) => ({
                ...prev,
                projects: prev.projects.map((project) =>
                    project.id === projectId ? updated : project,
                ),
            }));
            addNotification({
                title: "Projet modifie",
                body: `Projet "${projectName}" mis a jour.`,
                type: "info",
            });
        } catch (error) {
            // ignore
        }
    };

    const deleteProject = async (projectId) => {
        try {
            const currentProject = data.projects.find(
                (project) => project.id === projectId,
            );
            const projectName =
                (currentProject && currentProject.name) || "Projet";
            await apiRequest(`/projects/${projectId}`, { method: "DELETE" });
            setData((prev) => ({
                ...prev,
                projects: prev.projects.filter(
                    (project) => project.id !== projectId,
                ),
                tasks: prev.tasks.filter(
                    (task) => task.projectId !== projectId,
                ),
            }));
            addNotification({
                title: "Projet supprime",
                body: `Projet "${projectName}" supprime.`,
                type: "warning",
            });
        } catch (error) {
            // ignore
        }
    };

    const addTask = async (payload) => {
        try {
            const next = {
                id: createId(),
                title: payload.title,
                projectId: payload.projectId || "",
                status: payload.status || "todo",
                dueDate: payload.dueDate || "",
                createdAt: new Date().toISOString(),
            };
            const created = await apiRequest("/tasks", {
                method: "POST",
                body: next,
            });
            setData((prev) => ({
                ...prev,
                tasks: [created, ...prev.tasks],
            }));
            addNotification({
                title: "Nouvelle tache",
                body: `Tache "${payload.title}" creee.`,
                type: "success",
            }, { silentToast: true });
            toast.success("Tâche créée");
        } catch (error) {
            toast.error("Impossible de créer la tâche");
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            const currentTask = data.tasks.find((task) => task.id === taskId);
            const taskTitle =
                (currentTask && currentTask.title) ||
                updates.title ||
                "Tache";
            const updated = await apiRequest(`/tasks/${taskId}`, {
                method: "PUT",
                body: {
                    ...updates,
                    updatedAt: new Date().toISOString(),
                },
            });
            setData((prev) => ({
                ...prev,
                tasks: prev.tasks.map((task) =>
                    task.id === taskId ? updated : task,
                ),
            }));
            addNotification({
                title: "Tache modifiee",
                body: `Tache "${taskTitle}" mise a jour.`,
                type: "info",
            });
        } catch (error) {
            // ignore
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const currentTask = data.tasks.find((task) => task.id === taskId);
            const taskTitle = (currentTask && currentTask.title) || "Tache";
            await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
            setData((prev) => ({
                ...prev,
                tasks: prev.tasks.filter((task) => task.id !== taskId),
            }));
            addNotification({
                title: "Tache supprimee",
                body: `Tache "${taskTitle}" supprimee.`,
                type: "warning",
            });
        } catch (error) {
            // ignore
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            const rawUser = (() => {
                try {
                    return JSON.parse(localStorage.getItem("app_user") || "null");
                } catch (error) {
                    return null;
                }
            })();
            const rawRole = `${rawUser?.role || rawUser?.roles || rawUser?.profil || ""}`.toLowerCase();
            const role = rawRole === "admin" ? "administrateur" : rawRole || "collaborateur";
            if (role !== "administrateur") return;
            const currentTask = data.tasks.find((task) => task.id === taskId);
            const taskTitle =
                (currentTask && currentTask.title) ||
                "Tache";
            const updated = await apiRequest(`/tasks/${taskId}/status`, {
                method: "PATCH",
                body: { status },
            });
            setData((prev) => ({
                ...prev,
                tasks: prev.tasks.map((task) =>
                    task.id === taskId ? updated : task,
                ),
            }));
            if (status === "done") {
                addNotification({
                    title: "Tache terminee",
                    body: `Merci d'avoir termine la tache "${taskTitle}".`,
                    type: "success",
                });
            }
        } catch (error) {
            // ignore
        }
    };

    const addDiscussion = async (payload) => {
        try {
            const next = {
                id: createId(),
                title: payload.title,
            };
            const created = await apiRequest("/discussions", {
                method: "POST",
                body: {
                    id: next.id,
                    title: payload.title,
                    message: payload.message,
                },
            });
            setData((prev) => ({
                ...prev,
                discussions: [created, ...prev.discussions],
            }));
            addNotification({
                title: "Nouvelle discussion",
                body: `Discussion "${payload.title}" creee.`,
                type: "info",
            });
        } catch (error) {
            // ignore
        }
    };

    const addDiscussionReply = async (discussionId, message) => {
        try {
            const reply = await apiRequest(
                `/discussions/${discussionId}/messages`,
                {
                    method: "POST",
                    body: {
                        messageId: createId(),
                        author: "Vous",
                        body: message,
                    },
                },
            );
            setData((prev) => ({
                ...prev,
                discussions: prev.discussions.map((discussion) => {
                    if (discussion.id !== discussionId) return discussion;
                    return {
                        ...discussion,
                        messages: [...discussion.messages, reply],
                    };
                }),
            }));
        } catch (error) {
            // ignore
        }
    };

    const markNotificationRead = async (notificationId, read) => {
        try {
            const updated = await apiRequest(`/notifications/${notificationId}`, {
                method: "PATCH",
                body: { read },
            });
            setData((prev) => ({
                ...prev,
                notifications: prev.notifications.map((notification) =>
                    notification.id === notificationId ? updated : notification,
                ),
            }));
        } catch (error) {
            // ignore
        }
    };

    const markAllNotificationsRead = async () => {
        try {
            await apiRequest("/notifications/mark-all-read", {
                method: "PATCH",
            });
            setData((prev) => ({
                ...prev,
                notifications: prev.notifications.map((notification) => ({
                    ...notification,
                    read: true,
                })),
            }));
        } catch (error) {
            // ignore
        }
    };

    const unreadCount = useMemo(
        () =>
            data.notifications.filter((notification) => !notification.read)
                .length,
        [data.notifications],
    );

    const getProjectProgress = (projectId) => {
        const relevant = data.tasks.filter(
            (task) => task.projectId === projectId,
        );
        if (relevant.length === 0) return 0;
        const completed = relevant.filter((task) => task.status === "done")
            .length;
        return Math.round((completed / relevant.length) * 100);
    };

    const value = useMemo(
        () => ({
            ...data,
            unreadCount,
            addProject,
            updateProject,
            deleteProject,
            addTask,
            updateTaskStatus,
            updateTask,
            deleteTask,
            addDiscussion,
            addDiscussionReply,
            addNotification,
            markNotificationRead,
            markAllNotificationsRead,
            getProjectProgress,
        }),
        [data, unreadCount],
    );

    return (
        <AppStoreContext.Provider value={value}>
            {children}
        </AppStoreContext.Provider>
    );
}

export function useAppStore() {
    const context = useContext(AppStoreContext);
    if (!context) {
        throw new Error("useAppStore must be used inside AppStoreProvider");
    }
    return context;
}
