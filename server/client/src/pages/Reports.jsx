import React from 'react';
import { useAppStore } from '../store/AppStore';
import {
  PageWrap,
  PageHeader,
  PageTitle,
  SubtleText,
  Card,
  Grid,
  ProgressTrack,
  ProgressFill,
  EmptyState
} from './shared';

export default function Reports() {
  const { projects, tasks, getProjectProgress } = useAppStore();
  const completed = tasks.filter((task) => task.status === 'done').length;
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
  const todo = tasks.filter((task) => task.status === 'todo').length;

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>Rapports</PageTitle>
          <SubtleText>Indicateurs d&apos;avancement et synthese.</SubtleText>
        </div>
      </PageHeader>

      <Grid>
        <Card>
          <SubtleText>Taches terminees</SubtleText>
          <PageTitle>{completed}</PageTitle>
        </Card>
        <Card>
          <SubtleText>Taches en cours</SubtleText>
          <PageTitle>{inProgress}</PageTitle>
        </Card>
        <Card>
          <SubtleText>Taches a faire</SubtleText>
          <PageTitle>{todo}</PageTitle>
        </Card>
      </Grid>

      <Card>
        <PageTitle>Progression par projet</PageTitle>
        {projects.length === 0 ? (
          <EmptyState>Aucun projet a analyser.</EmptyState>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {projects.map((project) => {
              const progress = getProjectProgress(project.id);
              return (
                <div key={project.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
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
    </PageWrap>
  );
}
