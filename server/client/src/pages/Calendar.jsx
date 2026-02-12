import React, { useMemo, useState } from "react";
import { PageWrap, PageHeader, PageTitle, SubtleText, Card, Tag } from "./shared";
import { useAppStore } from "../store/AppStore";

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day + 6) % 7;
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
};
const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};
const formatKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
    ).padStart(2, "0")}`;

export default function Calendar() {
    const { tasks } = useAppStore();
    const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
    const [selectedDate, setSelectedDate] = useState(() => formatKey(new Date()));

    const tasksByDate = useMemo(() => {
        const grouped = {};
        tasks.forEach((task) => {
            if (!task.dueDate) return;
            const key = task.dueDate.slice(0, 10);
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(task);
        });
        return grouped;
    }, [tasks]);

    const calendarDays = useMemo(() => {
        const first = startOfMonth(currentMonth);
        const last = endOfMonth(currentMonth);
        const start = startOfWeek(first);
        const totalDays = Math.ceil((last - start) / (24 * 60 * 60 * 1000)) + 1;
        return Array.from({ length: totalDays }, (_, index) => addDays(start, index));
    }, [currentMonth]);

    const selectedTasks = tasksByDate[selectedDate] || [];
    const monthLabel = currentMonth.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    return (
        <PageWrap>
            <PageHeader>
                <div>
                    <PageTitle>Calendrier</PageTitle>
                    <SubtleText>
                        Visualisez les echeances et evenements.
                    </SubtleText>
                </div>
            </PageHeader>
            <Card>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap",
                    }}
                >
                    <PageTitle style={{ margin: 0, fontSize: "1.2rem" }}>
                        {monthLabel}
                    </PageTitle>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
                                )
                            }
                            style={{
                                border: "1px solid #e6e0d6",
                                borderRadius: "8px",
                                padding: "0.4rem 0.75rem",
                                background: "#ffffff",
                                cursor: "pointer",
                            }}
                        >
                            Mois precedent
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
                            style={{
                                border: "1px solid #e6e0d6",
                                borderRadius: "8px",
                                padding: "0.4rem 0.75rem",
                                background: "#ffffff",
                                cursor: "pointer",
                            }}
                        >
                            Aujourd&apos;hui
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
                                )
                            }
                            style={{
                                border: "1px solid #e6e0d6",
                                borderRadius: "8px",
                                padding: "0.4rem 0.75rem",
                                background: "#ffffff",
                                cursor: "pointer",
                            }}
                        >
                            Mois suivant
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                        gap: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                        <div
                            key={day}
                            style={{
                                fontSize: "0.8rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "#5b6460",
                            }}
                        >
                            {day}
                        </div>
                    ))}
                    {calendarDays.map((day) => {
                        const key = formatKey(day);
                        const inMonth = day.getMonth() === currentMonth.getMonth();
                        const isSelected = key === selectedDate;
                        const count = (tasksByDate[key] || []).length;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelectedDate(key)}
                                style={{
                                    minHeight: "72px",
                                    padding: "0.5rem",
                                    borderRadius: "12px",
                                    border: isSelected ? "2px solid #0f766e" : "1px solid #e6e0d6",
                                    background: inMonth ? "#ffffff" : "#f5f1ea",
                                    opacity: inMonth ? 1 : 0.7,
                                    textAlign: "left",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.35rem",
                                }}
                            >
                                <span style={{ fontWeight: 600 }}>{day.getDate()}</span>
                                {count > 0 && (
                                    <Tag $bg="#d1fae5" $color="#065f46">
                                        {count} tache{count > 1 ? "s" : ""}
                                    </Tag>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>

            <Card>
                <PageTitle style={{ margin: 0, fontSize: "1.2rem" }}>
                    Echeances du {selectedDate}
                </PageTitle>
                <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                    {selectedTasks.length === 0 ? (
                        <SubtleText>Aucune tache pour cette date.</SubtleText>
                    ) : (
                        selectedTasks.map((task) => (
                            <div
                                key={task.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "1rem",
                                    padding: "0.85rem",
                                    borderRadius: "12px",
                                    border: "1px solid #e6e0d6",
                                    background: "#ffffff",
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                                    <SubtleText>Statut: {task.status || "todo"}</SubtleText>
                                </div>
                                <Tag $bg="#fef3c7" $color="#92400e">
                                    {task.dueDate || "Sans date"}
                                </Tag>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </PageWrap>
    );
}
