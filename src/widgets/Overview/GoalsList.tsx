import type { GoalsResponse, GoalItem } from '../../data/models';
import { formatRand } from '../../lib/format';

export function GoalsListPlaceholder() {
  return (
    <div className="overview-goals skeleton" aria-label="Goals list loading placeholder">
      <div className="goal-row" />
      <div className="goal-row" />
    </div>
  );
}

interface GoalsListProps { readonly goals?: GoalsResponse }
export function GoalsList({ goals }: GoalsListProps) {
  if (!goals) {
    return (
  <section className="overview-goals" aria-labelledby="goals-heading">
        <h3 id="goals-heading" className="goals-title">Goals</h3>
        <p>Loading goals…</p>
      </section>
    );
  }
  if (!goals.goals.length) return <p>No goals yet</p>;
  return (
  <section className="overview-goals" aria-labelledby="goals-heading">
      <h3 id="goals-heading" className="goals-title">Goals</h3>
      <ul className="goals-list">
        {goals.goals.map(g => <GoalRow key={g.id} goal={g} />)}
      </ul>
    </section>
  );
}

function GoalRow({ goal }: { readonly goal: GoalItem }) {
  let statusClass: string;
  if (goal.status === 'on_track') statusClass = 'status-ok';
  else if (goal.status === 'warning') statusClass = 'status-warn';
  else statusClass = 'status-over';
  return (
    <li className={`goal-row ${statusClass}`}>
      <div className="goal-top">
        <span className="goal-cat">{goal.category}</span>
        <span className="goal-amount" data-testid={`goal-amount-${goal.id}`}>{formatRand(goal.currentSpent)} / {formatRand(goal.monthlyBudget)}</span>
      </div>
      <div className="goal-progress-wrapper">
        <progress
          className="goal-progress-bar"
          value={Math.min(100, goal.percentageUsed)}
          max={100}
          aria-label={`${goal.category} spending progress`}
        />
        <span className="goal-pct" aria-hidden>{goal.percentageUsed.toFixed(0)}%</span>
      </div>
      <div className="goal-meta">
        <span className="goal-days" data-testid={`goal-days-${goal.id}`}>{goal.daysRemaining}d left</span>
        <span className="goal-status" data-status={goal.status}>{goal.status.replace('_',' ')}</span>
      </div>
    </li>
  );
}
