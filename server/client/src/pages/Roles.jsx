import React, { useMemo } from "react";
import { useAppStore } from "../store/AppStore";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  SubtleText,
  Card,
  Grid,
  Tag,
  EmptyState,
} from "./shared";

export default function Roles() {
  const { roles, permissions, updateRolePermissions } = useAppStore();
  const currentRole = useMemo(() => {
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
  }, []);
  const isAdmin = currentRole === "administrateur";

  const palette = (category) => {
    const key = (category || "").toLowerCase();
    if (key.includes("pilotage")) return { label: "Pilotage", bg: "#e6f4f1", color: "#0f766e" };
    if (key.includes("execution")) return { label: "Execution", bg: "#fef3c7", color: "#92400e" };
    if (key.includes("gouvernance")) return { label: "Gouvernance", bg: "#e0e7ff", color: "#3730a3" };
    if (key.includes("lecture")) return { label: "Lecture seule", bg: "#f1f5f9", color: "#475569" };
    if (key.includes("controle")) return { label: "Controle", bg: "#fee2e2", color: "#b91c1c" };
    return { label: category || "Role", bg: "#f1f5f9", color: "#475569" };
  };

  const permissionMap = useMemo(() => {
    const map = {};
    permissions.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [permissions]);

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
      {roles.length === 0 ? (
        <EmptyState>Aucun role charge.</EmptyState>
      ) : (
        <Grid>
          {roles.map((role) => {
            const tag = palette(role.category);
            const rolePermissions = (role.permissions || []).map((perm) => perm.id);
            return (
              <Card key={role.id}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <PageTitle style={{ margin: 0, fontSize: "1.2rem" }}>
                  {role.name}
                </PageTitle>
                <Tag $bg={tag.bg} $color={tag.color}>
                  {tag.label}
                </Tag>
              </div>
              {role.description ? (
                <SubtleText>{role.description}</SubtleText>
              ) : null}
              {role.responsibilities?.length > 0 && (
                <ul style={{ margin: "0.85rem 0 0", paddingLeft: "1.1rem", color: "#5b6460" }}>
                  {role.responsibilities.map((item) => (
                    <li key={item} style={{ marginBottom: "0.35rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
                <SubtleText>Permissions</SubtleText>
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  {permissions.map((perm) => {
                    const checked = rolePermissions.includes(perm.id);
                    return (
                      <label key={perm.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!isAdmin}
                          onChange={(event) => {
                            if (!isAdmin) return;
                            const next = event.target.checked
                              ? [...rolePermissions, perm.id]
                              : rolePermissions.filter((id) => id !== perm.id);
                            updateRolePermissions(role.id, next);
                          }}
                        />
                        <span>
                          {permissionMap[perm.id]?.label || perm.label || perm.id}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              </Card>
            );
          })}
        </Grid>
      )}
    </PageWrap>
  );
}
