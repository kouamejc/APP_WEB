import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { buildApiUrl } from "../utils/api";
import {
    PageWrap,
    PageTitle,
    SubtleText,
    Card,
    FieldGroup,
    Input,
    PrimaryButton,
    GhostButton,
} from "./shared";

const AuthWrap = styled(PageWrap)
`
  min-height: calc(100vh - 4rem);
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const AuthCard = styled(Card)
`
  width: min(520px, 100%);
`;

const Actions = styled.div `
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
`;

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!email.trim() || !password.trim()) {
            toast.error("Email et mot de passe requis.");
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(buildApiUrl("/auth/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                }),
            });
            if (!res.ok) {
                let message = "Erreur connexion";
                const raw = await res.text();
                if (raw) {
                    try {
                        const data = JSON.parse(raw);
                        message = data && data.error ? data.error : message;
                    } catch (error) {
                        message = raw;
                    }
                }
                throw new Error(message);
            }
            const user = await res.json();
            localStorage.setItem("app_user", JSON.stringify(user));
            toast.success("Connexion reussie");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Identifiants invalides");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthWrap>
            <AuthCard as="form" onSubmit={handleSubmit}>
                <PageTitle>Connexion</PageTitle>
                <SubtleText>Accedez a votre espace avec vos identifiants.</SubtleText>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
                    <FieldGroup>
                        <label>Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="exemple@email.com"
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <label>Mot de passe</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Votre mot de passe"
                        />
                    </FieldGroup>
                    <Actions>
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </PrimaryButton>
                        <GhostButton as={Link} to="/register" type="button">
                            Creer un compte
                        </GhostButton>
                    </Actions>
                </div>
            </AuthCard>
        </AuthWrap>
    );
}
