import React, { useState } from "react";
import { useAppStore } from "../store/AppStore";
import {
    PageWrap,
    PageHeader,
    PageTitle,
    SubtleText,
    Card,
    FieldGroup,
    Input,
    Textarea,
    Select,
    PrimaryButton,
    GhostButton,
    EmptyState,
} from "./shared";

export default function Discussions() {
    const { discussions, tasks, addDiscussion, addDiscussionReply } = useAppStore();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [taskId, setTaskId] = useState("");
    const [replyMap, setReplyMap] = useState({});

    const handleCreate = (event) => {
        event.preventDefault();
        if (!title.trim() || !message.trim()) return;
        addDiscussion({ title: title.trim(), message: message.trim(), taskId });
        setTitle("");
        setMessage("");
        setTaskId("");
    };

    const handleReply = (discussionId) => {
        const reply = replyMap[discussionId];
        if (!reply || !reply.trim()) return;
        addDiscussionReply(discussionId, reply.trim());
        setReplyMap((prev) => ({ ...prev, [discussionId]: "" }));
    };

    return (
        <PageWrap>
            <PageHeader>
                <div>
                    <PageTitle>Discussions</PageTitle>
                    <SubtleText>
                        Creez des espaces de discussion et partagez des
                        messages.
                    </SubtleText>
                </div>
            </PageHeader>
            <Card as="form" onSubmit={handleCreate}>
                <PageTitle>Nouvelle discussion</PageTitle>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                    <FieldGroup>
                        <label>Titre</label>
                        <Input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Ex: Lancement sprint"
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <label>Message</label>
                        <Textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Votre message d'ouverture..."
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <label>Associer a une tache</label>
                        <Select
                            value={taskId}
                            onChange={(event) => setTaskId(event.target.value)}
                        >
                            <option value="">Aucune</option>
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.title}
                                </option>
                            ))}
                        </Select>
                    </FieldGroup>
                    <PrimaryButton type="submit">
                        Creer la discussion
                    </PrimaryButton>
                </div>
            </Card>
            {discussions.length === 0 ? (
                <EmptyState>Aucune discussion active.</EmptyState>
            ) : (
                <div style={{ display: "grid", gap: "1.25rem" }}>
                    {discussions.map((discussion) => (
                        <Card key={discussion.id}>
                            <PageTitle>{discussion.title}</PageTitle>
                            {discussion.taskId ? (
                                <SubtleText>
                                    Tache:{" "}
                                    {tasks.find((task) => task.id === discussion.taskId)?.title ||
                                        "Tache associee"}
                                </SubtleText>
                            ) : null}
                            <div
                                style={{
                                    marginTop: "1rem",
                                    display: "grid",
                                    gap: "0.75rem",
                                }}
                            >
                                {discussion.messages.map((messageItem) => (
                                    <div
                                        key={messageItem.id}
                                        style={{
                                            padding: "0.75rem",
                                            background: "#f8fafc",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <strong>{messageItem.author}</strong>
                                        <SubtleText>
                                            {messageItem.body}
                                        </SubtleText>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    marginTop: "1rem",
                                }}
                            >
                                <Input
                                    value={replyMap[discussion.id] || ""}
                                    onChange={(event) =>
                                        setReplyMap((prev) => ({
                                            ...prev,
                                            [discussion.id]:
                                                event.target.value,
                                        }))
                                    }
                                    placeholder="Repondre a cette discussion"
                                />
                                <GhostButton
                                    type="button"
                                    onClick={() =>
                                        handleReply(discussion.id)
                                    }
                                >
                                    Envoyer
                                </GhostButton>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageWrap>
    );
}
