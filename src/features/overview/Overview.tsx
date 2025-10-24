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
  TrendingUp,
  CreditCard,
  BanknoteArrowDown,
  ShoppingBag,
  Calendar,
  Target,
  Clock,
  PieChart,
  Activity,
} from "lucide-react";
import { useOverviewData } from "./useOverviewData";
import { formatCurrency, formatDate, Skeleton } from "../../design-system";
import { getCategoryColor } from "../../lib/chartConfig";
import {
  PageLayout,
  Grid,
  Card,
  MetricCard,
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
  const topCategory = summary?.topCategory || "N/A";
  const spentChange = summary?.comparedToPrevious?.spentChange || 0;

  const categoryData = categories?.categories || [];
  const goalsData = goals?.goals || [];
  const transactionData = transactions?.transactions || [];

  // Find top category amount from category data
  const topCategoryData = categoryData.find((c) => c.name === topCategory);
  const topCategoryAmount = topCategoryData?.amount || 0;

  // Calculate additional metrics
  const largestTransaction =
    transactionData.length > 0
      ? Math.max(...transactionData.map((t) => Math.abs(t.amount)))
      : 0;

  const mostFrequentCategory =
    categoryData.length > 0
      ? categoryData.reduce(
          (prev, current) =>
            (current.transactionCount || 0) > (prev.transactionCount || 0)
              ? current
              : prev,
          categoryData[0]
        ).name
      : "N/A";

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
      {/* 8 Comprehensive Summary Cards */}
      <Grid
        columns={{ mobile: 1, tablet: 2, desktop: 4 }}
        gap={{ mobile: 4, tablet: 5, desktop: 6 }}
      >
        {/* Card 1: Total Spent */}
        <MetricCard
          label={t("overview.totalSpent")}
          value={formatCurrency(totalSpent)}
          icon={<BanknoteArrowDown size={24} />}
          trend={
            spentChange === 0
              ? undefined
              : {
                  value: spentChange,
                  direction: spentChange > 0 ? "up" : "down",
                }
          }
          variant="primary"
          data-testid="summary-total"
        />

        {/* Card 2: Transaction Count */}
        <MetricCard
          label={t("overview.transactions")}
          value={transactionCount}
          icon={<CreditCard size={24} />}
          variant="default"
        />

        {/* Card 3: Average Transaction */}
        <MetricCard
          label={t("overview.avgTransaction")}
          value={formatCurrency(averageTransaction)}
          icon={<Activity size={24} />}
          variant="default"
        />

        {/* Card 4: Top Spending Category */}
        <Card padding={{ mobile: 4, desktop: 6 }}>
          <Stack spacing={3}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8B5CF6",
              }}
            >
              <ShoppingBag size={24} />
            </div>
            <Text
              variant="bodySm"
              color="muted"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              {t("overview.topCategory")}
            </Text>
            <Heading level={3}>{topCategory}</Heading>
            <Text variant="body" color="muted">
              {formatCurrency(topCategoryAmount)}
            </Text>
          </Stack>
        </Card>

        {/* Card 5: Largest Transaction */}
        <MetricCard
          label={t("overview.largestTransaction")}
          value={formatCurrency(largestTransaction)}
          icon={<TrendingUp size={24} />}
          variant="warning"
        />

        {/* Card 6: Most Frequent Category */}
        <Card padding={{ mobile: 4, desktop: 6 }}>
          <Stack spacing={3}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#06B6D4",
              }}
            >
              <PieChart size={24} />
            </div>
            <Text
              variant="bodySm"
              color="muted"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              Most Frequent
            </Text>
            <Heading level={3}>{mostFrequentCategory}</Heading>
            <Text variant="bodySm" color="muted">
              {categoryData.find((c) => c.name === mostFrequentCategory)
                ?.transactionCount || 0}{" "}
              transactions
            </Text>
          </Stack>
        </Card>

        {/* Card 7: Budget Status */}
        <MetricCard
          label={t("overview.budgetStatus")}
          value={`${budgetStatus.toFixed(0)}%`}
          icon={<Target size={24} />}
          variant={(() => {
            if (budgetStatus > 100) return "error";
            if (budgetStatus > 80) return "warning";
            return "success";
          })()}
        />

        {/* Card 8: Period */}
        <Card padding={{ mobile: 4, desktop: 6 }}>
          <Stack spacing={3}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(47, 112, 239, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2F70EF",
              }}
            >
              <Calendar size={24} />
            </div>
            <Text
              variant="bodySm"
              color="muted"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              {t("overview.period")}
            </Text>
            <Heading level={3}>
              {t(PERIODS.find((p) => p.key === activePeriod)?.label || "")}
            </Heading>
            <Text variant="bodySm" color="muted">
              {t("overview.selectedRange")}
            </Text>
          </Stack>
        </Card>
      </Grid>

      <Divider spacing={8} />

      {/* Charts Section */}
      <Stack spacing={6}>
        <Heading level={2}>{t("overview.categoryBreakdown")}</Heading>

        <Grid columns={{ mobile: 1, desktop: 2 }} gap={6}>
          {/* Category Breakdown Chart */}
          <Card padding={6}>
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
                />
              ) : (
                <Text variant="body" color="muted">
                  {t("overview.noCategoryData")}
                </Text>
              )}
            </Stack>
          </Card>

          {/* Spending Goals */}
          <Card padding={6}>
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
        </Grid>
      </Stack>

      <Divider spacing={8} />

      {/* Recent Transactions */}
      <Stack spacing={4}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Heading level={2}>{t("overview.recentTransactions")}</Heading>
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate("/transactions")}
          >
            View All →
          </Button>
        </div>

        {transactionData && transactionData.length > 0 ? (
          <Stack spacing={3}>
            {transactionData.slice(0, 5).map((txn) => (
              <Card key={txn.id} padding={4}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Stack spacing={1} style={{ flex: 1 }}>
                    <Text variant="body" weight="medium">
                      {txn.merchant}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <Badge
                        style={{
                          backgroundColor: `${getCategoryColor(
                            txn.category
                          )}20`,
                          color: getCategoryColor(txn.category),
                          borderColor: getCategoryColor(txn.category),
                        }}
                      >
                        {txn.category}
                      </Badge>
                      <Text variant="bodySm" color="muted">
                        {formatDate(txn.date)}
                      </Text>
                    </div>
                  </Stack>
                  <Text
                    variant="bodyLg"
                    weight="semibold"
                    color={txn.amount < 0 ? "strong" : "muted"}
                  >
                    {formatCurrency(Math.abs(txn.amount))}
                  </Text>
                </div>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card padding={8}>
            <Stack spacing={2} align="center">
              <Clock
                size={48}
                style={{ color: "var(--neutral-400)", strokeWidth: 1.5 }}
              />
              <Text variant="body" color="muted">
                {t("overview.noRecentTransactions")}
              </Text>
            </Stack>
          </Card>
        )}
      </Stack>

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
