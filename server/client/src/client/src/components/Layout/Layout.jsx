import React, { useMemo, useState } from "react";
import {
    Outlet,
    useNavigate,
    NavLink as RouterNavLink,
} from "react-router-dom";
import styled from "styled-components";
import {
    FiHome,
    FiGrid,
    FiCheckSquare,
    FiUsers,
    FiCalendar,
    FiBarChart2,
    FiBell,
    FiMenu,
    FiSearch,
    FiPlus,
    FiMessageSquare,
    FiUserCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAppStore } from "../../../../store/AppStore";

const LayoutContainer = styled.div `
  display: flex;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  transition: all 0.3s ease;
`;

const Sidebar = styled(motion.aside)
`
  width: 280px;
  background: ${(props) => props.theme.colors.sidebar};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  @media (max-width: 768px) {
    transform: ${(props) =>
      props.$isOpen ? "translateX(0)" : "translateX(-100%)"};
    position: fixed;
  }
`;

const MainContent = styled.main `
  flex: 1;
  margin-left: ${(props) => (props.$sidebarOpen ? "280px" : "0")};
  transition: margin-left 0.3s ease;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.header `
  height: 70px;
  background: ${(props) => props.theme.colors.header};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
`;

const Logo = styled.div `
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0f766e 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchBar = styled.div `
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  position: relative;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SearchInput = styled.input `
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.inputBackground};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.14);
  }
`;

const UserMenu = styled.div `
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NotificationBadge = styled.div `
  position: relative;
  cursor: pointer;
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #f56565;
    color: white;
    font-size: 0.7rem;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CreateButton = styled.button `
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, #14b8a6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const NavList = styled.ul `
  list-style: none;
  padding: 2rem 1rem;
  flex: 1;
  overflow-y: auto;
`;

const NavItem = styled.li `
  margin-bottom: 0.5rem;
`;

const NavLink = styled.div `
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 700;
  &:hover {
    background: ${(props) => props.theme.colors.hover};
    color: ${(props) => props.theme.colors.text};
  }
  &.active {
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, #14b8a6 100%);
    color: #ffffff;
  }
`;

const Overlay = styled.div `
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Modal = styled.div `
  background: #ffffff;
  border-radius: 18px;
  width: min(560px, 92vw);
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
`;

const ModalHeader = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3 `
  margin: 0;
`;

const FieldGroup = styled.div `
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Input = styled.input.attrs({ required: true })`
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  outline: none;
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }
`;

const Textarea = styled.textarea.attrs({ required: true })`
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  min-height: 110px;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }
`;

const Select = styled.select.attrs({ required: true })`
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  outline: none;
  background: #ffffff;
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }
`;

const ModalActions = styled.div `
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
`;

const GhostButton = styled.button `
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
`;

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [createType, setCreateType] = useState("task");
    const [formState, setFormState] = useState({
        title: "",
        description: "",
        message: "",
        projectId: "",
        status: "todo",
        dueDate: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { projects, tasks, discussions, unreadCount, addProject, addTask, addDiscussion } =
        useAppStore();
    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("app_user") || "null");
        } catch (error) {
            return null;
        }
    }, []);
    const currentRole = useMemo(() => {
        if (!currentUser) return "collaborateur";
        const raw = `${currentUser.role || currentUser.roles || currentUser.profil || ""}`.toLowerCase();
        if (!raw) return "collaborateur";
        if (raw === "admin") return "administrateur";
        return raw;
    }, [currentUser]);

    const navItems = useMemo(
        () => {
            const items = [
                { label: "Tableau de bord", icon: <FiHome />, to: "/dashboard" },
                { label: "Projets", icon: <FiGrid />, to: "/projects" },
                { label: "Taches", icon: <FiCheckSquare />, to: "/tasks" },
                {
                    label: "Discussions",
                    icon: <FiMessageSquare />,
                    to: "/discussions",
                },
                { label: "Notifications", icon: <FiBell />, to: "/notifications" },
                { label: "Equipes", icon: <FiUsers />, to: "/teams", adminOnly: true },
                { label: "Roles", icon: <FiUserCheck />, to: "/roles", adminOnly: true },
                { label: "Calendrier", icon: <FiCalendar />, to: "/calendar" },
                { label: "Rapports", icon: <FiBarChart2 />, to: "/reports", adminOnly: true },
            ];
            if (currentRole === "administrateur") return items;
            return items.filter((item) => !item.adminOnly);
        }, [currentRole],
    );

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return { projects: [], tasks: [], discussions: [] };
        return {
            projects: projects.filter((project) =>
                `${project.name} ${project.description || ""}`
                    .toLowerCase()
                    .includes(query),
            ),
            tasks: tasks.filter((task) =>
                `${task.title} ${task.description || ""} ${task.status || ""} ${task.dueDate || ""} ${task.assignedToName || ""}`
                    .toLowerCase()
                    .includes(query),
            ),
            discussions: discussions.filter((discussion) =>
                `${discussion.title || ""}`.toLowerCase().includes(query),
            ),
        };
    }, [projects, tasks, discussions, searchQuery]);

    const hasResults =
        searchResults.projects.length > 0 ||
        searchResults.tasks.length > 0 ||
        searchResults.discussions.length > 0;

    const handleSearchNavigate = (path) => {
        navigate(path);
        setSearchQuery("");
    };

    const resetForm = () => {
        setFormState({
            title: "",
            description: "",
            message: "",
            projectId: "",
            status: "todo",
            dueDate: "",
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (createType === "project") {
            if (!formState.title.trim()) return;
            addProject({
                name: formState.title.trim(),
                description: formState.description.trim(),
            });
            navigate("/projects");
        }
        if (createType === "task") {
            if (!formState.title.trim()) return;
            addTask({
                title: formState.title.trim(),
                description: formState.description.trim(),
                projectId: formState.projectId,
                status: formState.status,
                dueDate: formState.dueDate,
            });
            navigate("/tasks");
        }
        if (createType === "discussion") {
            if (!formState.title.trim() || !formState.message.trim()) return;
            addDiscussion({
                title: formState.title.trim(),
                message: formState.message.trim(),
            });
            navigate("/discussions");
        }
        resetForm();
        setCreateOpen(false);
    };

    return (
        <LayoutContainer>
            <Sidebar $isOpen={sidebarOpen}>
                <div
                    style={{
                        padding: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}
                >
                    <Logo>MonAppWeb</Logo>
                </div>
                <NavList>
                    {navItems.map((item) => (
                        <NavItem key={item.to}>
                            <NavLink
                                as={RouterNavLink}
                                to={item.to}
                                className={({ isActive }) =>
                                    isActive ? "active" : ""
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </NavItem>
                    ))}
                </NavList>
            </Sidebar>

            <MainContent $sidebarOpen={sidebarOpen}>
                <Header>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <FiMenu
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{ cursor: "pointer" }}
                        />
                        <Logo>MyApp</Logo>
                    </div>
                    <SearchBar>
                        <FiSearch
                            style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9aa0b4",
                            }}
                        />
                        <SearchInput
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        {searchQuery.trim().length > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    left: 0,
                                    right: 0,
                                    background: "#ffffff",
                                    border: "1px solid #e6e0d6",
                                    borderRadius: "14px",
                                    padding: "0.75rem",
                                    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
                                    zIndex: 80,
                                }}
                            >
                                {!hasResults ? (
                                    <div style={{ color: "#5b6460", fontSize: "0.9rem" }}>
                                        Aucun resultat pour "{searchQuery}"
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gap: "0.75rem" }}>
                                        {searchResults.projects.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: "0.8rem", color: "#5b6460" }}>
                                                    Projets
                                                </div>
                                                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.4rem" }}>
                                                    {searchResults.projects.slice(0, 4).map((project) => (
                                                        <button
                                                            key={project.id}
                                                            type="button"
                                                            onClick={() => handleSearchNavigate("/projects")}
                                                            style={{
                                                                textAlign: "left",
                                                                border: "1px solid #ede7db",
                                                                borderRadius: "10px",
                                                                padding: "0.5rem 0.6rem",
                                                                background: "#fdfbf7",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: 600 }}>{project.name}</div>
                                                            {project.description && (
                                                                <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                                                                    {project.description}
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {searchResults.tasks.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: "0.8rem", color: "#5b6460" }}>
                                                    Taches
                                                </div>
                                                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.4rem" }}>
                                                    {searchResults.tasks.slice(0, 4).map((task) => (
                                                        <button
                                                            key={task.id}
                                                            type="button"
                                                            onClick={() => handleSearchNavigate("/tasks")}
                                                            style={{
                                                                textAlign: "left",
                                                                border: "1px solid #ede7db",
                                                                borderRadius: "10px",
                                                                padding: "0.5rem 0.6rem",
                                                                background: "#fdfbf7",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: 600 }}>{task.title}</div>
                                                            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                                                                Statut: {task.status || "todo"}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {searchResults.discussions.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: "0.8rem", color: "#5b6460" }}>
                                                    Discussions
                                                </div>
                                                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.4rem" }}>
                                                    {searchResults.discussions.slice(0, 4).map((discussion) => (
                                                        <button
                                                            key={discussion.id}
                                                            type="button"
                                                            onClick={() => handleSearchNavigate("/discussions")}
                                                            style={{
                                                                textAlign: "left",
                                                                border: "1px solid #ede7db",
                                                                borderRadius: "10px",
                                                                padding: "0.5rem 0.6rem",
                                                                background: "#fdfbf7",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: 600 }}>{discussion.title}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </SearchBar>
                    <UserMenu>
                        <div style={{ fontSize: "0.9rem", color: "#5b6460" }}>
                            {(() => {
                                if (!currentUser) return "Utilisateur";
                                const first = `${currentUser.firstName || ""}`.trim();
                                const last = `${currentUser.lastName || ""}`.trim();
                                if (first && last && first.toLowerCase() !== last.toLowerCase()) {
                                    return `${first} ${last}`;
                                }
                                if (first) return first;
                                if (last) return last;
                                return "Utilisateur";
                            })()}
                        </div>
                        <CreateButton onClick={() => setCreateOpen(true)}>
                            <FiPlus />
                            Creer
                        </CreateButton>
                        <GhostButton
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("app_user");
                                navigate("/login");
                            }}
                        >
                            Deconnexion
                        </GhostButton>
                        <NotificationBadge
                            onClick={() => navigate("/notifications")}
                        >
                            <FiBell />
                            {unreadCount > 0 && (
                                <div className="badge">{unreadCount}</div>
                            )}
                        </NotificationBadge>
                    </UserMenu>
                </Header>

                <div style={{ padding: "2rem" }}>
                    <Outlet />
                </div>
            </MainContent>

            {createOpen && (
                <Overlay>
                    <Modal
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ModalHeader>
                            <ModalTitle>Creation rapide</ModalTitle>
                            <GhostButton
                                type="button"
                                onClick={() => {
                                    setCreateOpen(false);
                                    resetForm();
                                }}
                            >
                                Fermer
                            </GhostButton>
                        </ModalHeader>
                        <form
                            onSubmit={handleSubmit}
                            style={{ display: "grid", gap: "1rem" }}
                        >
                            <FieldGroup>
                                <label>Type</label>
                                <Select
                                    value={createType}
                                    onChange={(event) =>
                                        setCreateType(event.target.value)
                                    }
                                >
                                    <option value="task">Tache</option>
                                    <option value="project">Projet</option>
                                    <option value="discussion">Discussion</option>
                                </Select>
                            </FieldGroup>
                            <FieldGroup>
                                <label>Titre</label>
                                <Input
                                    value={formState.title}
                                    onChange={(event) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            title: event.target.value,
                                        }))
                                    }
                                    placeholder="Nom ou titre"
                                />
                            </FieldGroup>
                            {(createType === "project" || createType === "task") && (
                                <FieldGroup>
                                    <label>Description</label>
                                    <Textarea
                                        value={formState.description}
                                        onChange={(event) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                description: event.target.value,
                                            }))
                                        }
                                    />
                                </FieldGroup>
                            )}
                            {createType === "task" && (
                                <>
                                    <FieldGroup>
                                        <label>Projet associe</label>
                                        <Select
                                            value={formState.projectId}
                                            onChange={(event) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    projectId:
                                                        event.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">
                                                Sans projet
                                            </option>
                                            {projects.map((project) => (
                                                <option
                                                    key={project.id}
                                                    value={project.id}
                                                >
                                                    {project.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </FieldGroup>
                                    <FieldGroup>
                                        <label>Statut</label>
                                        <Select
                                            value={formState.status}
                                            onChange={(event) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    status: event.target.value,
                                                }))
                                            }
                                        >
                                            <option value="todo">
                                                A faire
                                            </option>
                                            <option value="in_progress">
                                                En cours
                                            </option>
                                            <option value="done">
                                                Terminee
                                            </option>
                                        </Select>
                                    </FieldGroup>
                                    <FieldGroup>
                                        <label>Echeance</label>
                                        <Input
                                            type="date"
                                            value={formState.dueDate}
                                            onChange={(event) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    dueDate:
                                                        event.target.value,
                                                }))
                                            }
                                        />
                                    </FieldGroup>
                                </>
                            )}
                            {createType === "discussion" && (
                                <FieldGroup>
                                    <label>Message</label>
                                    <Textarea
                                        value={formState.message}
                                        onChange={(event) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                message: event.target.value,
                                            }))
                                        }
                                    />
                                </FieldGroup>
                            )}
                            <ModalActions>
                                <GhostButton
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setCreateOpen(false);
                                    }}
                                >
                                    Annuler
                                </GhostButton>
                                <CreateButton type="submit">
                                    <FiPlus />
                                    Creer
                                </CreateButton>
                            </ModalActions>
                        </form>
                    </Modal>
                </Overlay>
            )}
        </LayoutContainer>
    );
}

export default Layout;
