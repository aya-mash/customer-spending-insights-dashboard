/**
 * OVERVIEW PAGE
 * Comprehensive dashboard with 8 metric cards, charts, and goals
 * Built with design system components - zero CSS dependencies
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import {
  CreditCard,
  BanknoteArrowDown,
  Clock,
  Activity,
  Target,
} from "lucide-react";
import { useOverviewData } from "./useOverviewData";
import { formatCurrency, formatDate, Skeleton } from "../../design-system";
import { getCategoryColor } from "../../lib/categoryUtils";
import {
  PageLayout,
  Grid,
  Card,
  Stack,
  Button,
  Heading,
  Text,
  Badge,
  Divider,
  DonutChart,
  Tabs,
} from "../../design-system/components/index";
import { radius } from "../../design-system/tokens";
import type { PeriodPreset } from "../../data/models";
import { GoalDialog } from "./GoalDialog";
import { useQuery } from "@tanstack/react-query";

const PERIODS: Array<{ key: PeriodPreset; label: string }> = [
  { key: "7d", label: "overview.period7d" },
  { key: "30d", label: "overview.period30d" },
  { key: "90d", label: "overview.period90d" },
  { key: "1y", label: "overview.period1y" },
];

// Period selector component (extracted outside Overview)
interface PeriodSelectorProps {
  activePeriod: PeriodPreset;
  onPeriodChange: (period: PeriodPreset) => void;
  t: (key: string) => string;
}

const PeriodSelector = ({
  activePeriod,
  onPeriodChange,
  t,
}: PeriodSelectorProps) => (
  <Tabs
    items={PERIODS.map((p) => ({ key: p.key, label: t(p.label) }))}
    activeTab={activePeriod}
    onChange={(key) => onPeriodChange(key as PeriodPreset)}
    aria-label="Time period selection"
  />
);

export function Overview() {
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState<PeriodPreset>("30d");
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<(typeof goalsData)[0] | null>(
    null
  );
  const customerId = "user123";
  const navigate = useNavigate();
  const { user, isPending } = useAuthenticator((context) => [context.user]);
  const { data: userAttributes } = useQuery({
    queryKey: ["userAttributes", user?.username],
    queryFn: async () => await fetchUserAttributes(),
    enabled: !!user,
  });

  const {
    summary,
    goals,
    categories,
    transactions,
    isInitialLoading,
    isError,
    hasPartialData,
    retry,
  } = useOverviewData(customerId, activePeriod);

  // Show skeleton only if everything is still loading and we have no data yet
  if ((isInitialLoading && !hasPartialData) || isPending) {
    return <OverviewSkeleton />;
  }

  const totalSpent = summary?.totalSpent || 0;
  const transactionCount = summary?.transactionCount || 0;
  const averageTransaction = summary?.averageTransaction || 0;
  const spentChange = summary?.comparedToPrevious?.spentChange || 0;

  const categoryData = categories?.categories || [];
  const goalsData = goals?.goals || [];
  const transactionData = transactions?.transactions || [];

  // Calculate budget status across all goals
  const budgetStatus =
    goalsData.length > 0
      ? goalsData.reduce(
          (sum, goal) => sum + (goal.currentSpent / goal.monthlyBudget) * 100,
          0
        ) / goalsData.length
      : 0;

  return (
    <PageLayout
      title={
        userAttributes?.given_name ? `Hi, ${userAttributes.given_name}!` : ""
      }
      subtitle={`View your financial summary for the past ${t(
        PERIODS.find((p) => p.key === activePeriod)?.label || ""
      ).toLowerCase()}`}
      actions={
        <PeriodSelector
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
          t={t}
        />
      }
    >
      {/* If some data loaded but at least one resource failed, surface an inline alert with a retry */}
      {isError && hasPartialData && (
        <Card padding={4}>
          <Stack spacing={3} align="center">
            <Text variant="bodySm" color="muted">
              {t("overview.partialError")}
            </Text>
            <Button onClick={retry} variant="secondary" size="small">
              {t("common.retry")}
            </Button>
          </Stack>
        </Card>
      )}
      {/* Summary Metrics - Single Row */}
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={4}>
        {/* Total Spent */}
        <Card padding={5}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(47, 112, 239, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2F70EF",
              }}
            >
              <BanknoteArrowDown size={20} />
            </div>
            {spentChange !== 0 && (
              <Badge variant={spentChange > 0 ? "error" : "success"}>
                {spentChange > 0 ? "+" : ""}
                {spentChange.toFixed(1)}%
              </Badge>
            )}
          </div>
          <Text
            variant="bodySm"
            color="muted"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {t("overview.totalSpent")}
          </Text>
          <Heading level={2} style={{ fontSize: "28px", margin: 0 }}>
            {formatCurrency(totalSpent)}
          </Heading>
        </Card>

        {/* Transactions */}
        <Card padding={5}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981",
              }}
            >
              <CreditCard size={20} />
            </div>
            {summary?.comparedToPrevious?.transactionChange !== undefined &&
              summary.comparedToPrevious.transactionChange !== 0 && (
                <Badge
                  variant={
                    summary.comparedToPrevious.transactionChange > 0
                      ? "success"
                      : "warning"
                  }
                >
                  {summary.comparedToPrevious.transactionChange > 0 ? "+" : ""}
                  {summary.comparedToPrevious.transactionChange.toFixed(1)}%
                </Badge>
              )}
          </div>
          <Text
            variant="bodySm"
            color="muted"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {t("overview.transactions")}
          </Text>
          <Heading level={2} style={{ fontSize: "28px", margin: 0 }}>
            {transactionCount.toLocaleString()}
          </Heading>
        </Card>

        {/* Average Transaction */}
        <Card padding={5}>
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8B5CF6",
              }}
            >
              <Activity size={20} />
            </div>
          </div>
          <Text
            variant="bodySm"
            color="muted"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {t("overview.avgTransaction")}
          </Text>
          <Heading level={2} style={{ fontSize: "28px", margin: 0 }}>
            {formatCurrency(averageTransaction)}
          </Heading>
        </Card>

        {/* Budget Status - Overall budget health */}
        <Card padding={5}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: (() => {
                  if (budgetStatus > 100) return "rgba(239, 68, 68, 0.1)";
                  if (budgetStatus > 80) return "rgba(245, 158, 11, 0.1)";
                  return "rgba(16, 185, 129, 0.1)";
                })(),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: (() => {
                  if (budgetStatus > 100) return "#EF4444";
                  if (budgetStatus > 80) return "#F59E0B";
                  return "#10B981";
                })(),
              }}
            >
              <Target size={20} />
            </div>
            {budgetStatus > 0 && (
              <Badge
                variant={(() => {
                  if (budgetStatus > 100) return "error";
                  if (budgetStatus > 80) return "warning";
                  return "success";
                })()}
              >
                {(() => {
                  if (budgetStatus > 100) return "Over";
                  if (budgetStatus > 80) return "Watch";
                  return "Good";
                })()}
              </Badge>
            )}
          </div>
          <Text
            variant="bodySm"
            color="muted"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {t("overview.budgetStatus")}
          </Text>
          <Heading level={2} style={{ fontSize: "28px", margin: 0 }}>
            {budgetStatus > 0 ? `${budgetStatus.toFixed(0)}%` : "No Goals"}
          </Heading>
        </Card>
      </Grid>

      <Divider spacing={8} />

      {/* Charts and Transactions Section */}
      <Grid columns={{ mobile: 1, desktop: 3 }} gap={4}>
        {/* Category Breakdown Chart */}
        <Card padding={5}>
          <Stack spacing={4}>
            <Heading level={3}>{t("overview.categoryBreakdown")}</Heading>
            {categoryData && categoryData.length > 0 ? (
              <DonutChart
                data={categoryData}
                total={totalSpent}
                onSegmentClick={(name: string) =>
                  navigate(
                    `/transactions?category=${encodeURIComponent(name)}`
                  )
                }
                height={240}
              />
            ) : (
              <Text variant="body" color="muted">
                {t("overview.noCategoryData")}
              </Text>
            )}
          </Stack>
        </Card>

        {/* Spending Goals */}
        <Card padding={5}>
          <Stack spacing={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Heading level={3}>{t("overview.spendingGoals")}</Heading>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowGoalDialog(true)}
              >
                {t("overview.addGoal")}
              </Button>
            </div>

            {goalsData && goalsData.length > 0 ? (
              <Stack spacing={4}>
                {goalsData.map((goal) => {
                  const progress =
                    (goal.currentSpent / goal.monthlyBudget) * 100;
                  const isOverBudget = progress > 100;

                  let progressVariant: "error" | "warning" | "success";
                  let progressColor: string;

                  if (isOverBudget) {
                    progressVariant = "error";
                    progressColor = "#EF4444";
                  } else if (progress > 80) {
                    progressVariant = "warning";
                    progressColor = "#F59E0B";
                  } else {
                    progressVariant = "success";
                    progressColor = "#10B981";
                  }

                  return (
                    <Stack key={goal.id} spacing={2}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text variant="body" weight="medium">
                          {goal.category}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <Badge variant="default">
                            <Clock size={12} style={{ marginRight: "4px" }} />
                            {goal.daysRemaining}
                            {t("overview.daysLeft")}
                          </Badge>
                          <Badge variant={progressVariant}>
                            {progress.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#E5E7EB",
                          borderRadius: radius.md,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            height: "100%",
                            backgroundColor: progressColor,
                            borderRadius: radius.md,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>

                      <Text variant="bodySm" color="muted">
                        {formatCurrency(goal.currentSpent)} {t("overview.of")}{" "}
                        {formatCurrency(goal.monthlyBudget)}
                      </Text>
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <Stack spacing={3} align="center">
                <Text variant="body" color="muted">
                  {t("overview.noGoals")}
                </Text>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowGoalDialog(true)}
                >
                  {t("overview.manage")}
                </Button>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Recent Transactions */}
        <Card padding={5}>
          <Stack spacing={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Heading level={3}>{t("overview.recentTransactions")}</Heading>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate("/transactions")}
              >
                View All →
              </Button>
            </div>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {transactionData && transactionData.length > 0 ? (
                <Stack spacing={2}>
                  {transactionData.slice(0, 4).map((txn) => (
                    <div
                      key={txn.id}
                      style={{
                        padding: "12px",
                        borderRadius: radius.md,
                        backgroundColor: "var(--surface-raised)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Text variant="body" weight="medium">
                          {txn.merchant}
                        </Text>
                        <Badge
                          style={{
                            backgroundColor: `${getCategoryColor(
                              txn.category,
                              txn.categoryColor
                            )}20`,
                            color: getCategoryColor(txn.category, txn.categoryColor),
                            borderColor: getCategoryColor(txn.category, txn.categoryColor),
                            fontSize: "11px",
                            padding: "2px 8px",
                          }}
                        >
                          {txn.category}
                        </Badge>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text variant="bodySm" color="muted">
                          {formatDate(txn.date)}
                        </Text>
                        <Text
                          variant="body"
                          weight="semibold"
                          color={txn.amount < 0 ? "strong" : "muted"}
                        >
                          {formatCurrency(Math.abs(txn.amount))}
                        </Text>
                      </div>
                    </div>
                  ))}
                </Stack>
              ) : (
                <Stack spacing={2} align="center" style={{ paddingTop: "32px" }}>
                  <Clock
                    size={48}
                    style={{ color: "var(--neutral-400)", strokeWidth: 1.5 }}
                  />
                  <Text variant="body" color="muted">
                    {t("overview.noRecentTransactions")}
                  </Text>
                </Stack>
              )}
            </div>
          </Stack>
        </Card>
      </Grid>

      {/* Goal Dialog */}
      <GoalDialog
        isOpen={showGoalDialog}
        onClose={() => {
          setShowGoalDialog(false);
          setEditingGoal(null);
        }}
        onSave={() => {
          // TODO: Integrate with backend API
          // Goal saving logic will be implemented when backend endpoint is available
          setShowGoalDialog(false);
          setEditingGoal(null);
        }}
        existingGoal={editingGoal}
        categories={goalsData.map((g) => g.category)}
      />
    </PageLayout>
  );
}

function OverviewSkeleton() {
  return (
    <PageLayout>
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={6}>
        {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
          <Card key={key} padding={6}>
            <Stack spacing={3}>
              <Skeleton width="40px" height="40px" variant="circular" />
              <Skeleton width="60%" height="16px" />
              <Skeleton width="100%" height="32px" />
              <Skeleton width="80%" height="14px" />
            </Stack>
          </Card>
        ))}
      </Grid>
    </PageLayout>
  );
}
