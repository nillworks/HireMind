"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  Crown,
  Briefcase,
  Users,
  Search,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  getAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
  seedPlans,
  type AdminPlan,
} from "@/lib/api/admin/plansApi";
import { toast } from "sonner";

const PlansManagementPage = () => {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getAdminPlans();
      setPlans(data);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filtered = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (plan: AdminPlan) => {
    if (!confirm(`Delete "${plan.name}"? This cannot be undone.`)) return;
    setDeleting(plan._id);
    try {
      await deleteAdminPlan(plan._id);
      setPlans((prev) => prev.filter((p) => p._id !== plan._id));
      toast.success("Plan deleted");
    } catch {
      toast.error("Failed to delete plan");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleFree = async (plan: AdminPlan) => {
    try {
      await updateAdminPlan(plan._id, { isFree: !plan.isFree });
      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? { ...p, isFree: !p.isFree } : p))
      );
      toast.success("Plan updated");
    } catch {
      toast.error("Failed to update plan");
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will replace all plans with defaults. Continue?")) return;
    setSeeding(true);
    try {
      await seedPlans();
      await fetchPlans();
      toast.success("Plans reseeded from defaults");
    } catch {
      toast.error("Failed to reseed plans");
    } finally {
      setSeeding(false);
    }
  };

  const handleSave = async (planData: Partial<AdminPlan>) => {
    try {
      if (editingPlan) {
        await updateAdminPlan(editingPlan._id, planData);
        setPlans((prev) =>
          prev.map((p) =>
            p._id === editingPlan._id ? { ...p, ...planData } : p
          )
        );
        toast.success("Plan updated");
      } else {
        const newPlan = await createAdminPlan(planData as any);
        setPlans((prev) => [...prev, newPlan]);
        toast.success("Plan created");
      }
      setShowForm(false);
      setEditingPlan(null);
    } catch {
      toast.error(editingPlan ? "Failed to update plan" : "Failed to create plan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
            Manage <span className="text-PrimaryColor">Plans</span>
          </h1>
          <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mt-1">
            Create, edit, and manage subscription plans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-xl border border-Border dark:border-secondary px-4 py-2.5 text-sm font-medium font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors cursor-pointer disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Reseed
          </button>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-4 py-2.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] pl-9 pr-4 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] px-4 text-sm font-SecondaryFont text-TextPrimary dark:text-white focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="seeker">Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </div>

      {showForm && (
        <PlanForm
          plan={editingPlan}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-Border dark:bg-secondary rounded-xl" />
                <div className="h-5 w-32 bg-Border dark:bg-secondary rounded" />
              </div>
              <div className="h-3 w-full bg-Border dark:bg-secondary rounded mb-2" />
              <div className="h-3 w-2/3 bg-Border dark:bg-secondary rounded mb-4" />
              <div className="h-8 w-full bg-Border dark:bg-secondary rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
          <Crown size={40} className="mx-auto text-TextMuted mb-3" />
          <p className="text-sm font-SecondaryFont text-TextMuted">
            No plans found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((plan) => (
            <div
              key={plan._id}
              className={`relative rounded-2xl bg-white dark:bg-[#1e293b] border p-5 transition-all ${
                plan.role === "seeker"
                  ? "border-PrimaryColor/20 hover:border-PrimaryColor/40"
                  : "border-SrcPrimaryColor/20 hover:border-SrcPrimaryColor/40"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      plan.role === "seeker"
                        ? "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20"
                        : "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20"
                    }`}
                  >
                    {plan.role === "seeker" ? (
                      <Briefcase size={18} className="text-PrimaryColor" />
                    ) : (
                      <Users size={18} className="text-SrcPrimaryColor" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] font-SecondaryFont text-TextMuted">
                      <code className="bg-BorderLight dark:bg-secondary/20 px-1 py-0.5 rounded">
                        {plan.id}
                      </code>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFree(plan)}
                  className="cursor-pointer"
                  title={plan.isFree ? "Free plan" : "Paid plan"}
                >
                  {plan.isFree ? (
                    <ToggleLeft size={28} className="text-TextMuted" />
                  ) : (
                    <ToggleRight size={28} className="text-emerald-500" />
                  )}
                </button>
              </div>

              <p className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-3 line-clamp-2">
                {plan.description}
              </p>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                  {plan.priceLabel}
                </span>
                {!plan.isFree && (
                  <span className="text-xs font-SecondaryFont text-TextMuted">
                    / {plan.interval}
                  </span>
                )}
                <span
                  className={`ml-auto text-[10px] font-bold font-SecondaryFont uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    plan.role === "seeker"
                      ? "bg-PrimaryColor/10 text-PrimaryColor"
                      : "bg-SrcPrimaryColor/10 text-SrcPrimaryColor"
                  }`}
                >
                  {plan.role}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {plan.features.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="text-[10px] font-SecondaryFont text-TextMuted bg-BorderLight dark:bg-secondary/20 px-2 py-0.5 rounded-full"
                  >
                    {f}
                  </span>
                ))}
                {plan.features.length > 3 && (
                  <span className="text-[10px] font-SecondaryFont text-TextMuted">
                    +{plan.features.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-Border dark:border-secondary">
                <button
                  onClick={() => {
                    setEditingPlan(plan);
                    setShowForm(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-Border dark:border-secondary py-2 text-xs font-medium font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors cursor-pointer"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  disabled={deleting === plan._id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 py-2 text-xs font-medium font-SecondaryFont text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting === plan._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Plan Form ──────────────────────────────────────────────────────

interface PlanFormProps {
  plan: AdminPlan | null;
  onSave: (data: Partial<AdminPlan>) => void;
  onCancel: () => void;
}

const PlanForm = ({ plan, onSave, onCancel }: PlanFormProps) => {
  const [form, setForm] = useState({
    id: plan?.id || "",
    name: plan?.name || "",
    description: plan?.description || "",
    price: plan?.price || 0,
    priceLabel: plan?.priceLabel || "",
    interval: plan?.interval || "month",
    role: plan?.role || "seeker",
    features: plan?.features?.join("\n") || "",
    maxApplications: plan?.limits?.maxApplications || 0,
    maxJobPosts: plan?.limits?.maxJobPosts || 0,
    stripePriceId: plan?.stripePriceId || "",
    isFree: plan?.isFree ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const limits: Record<string, number> = {};
    if (form.role === "seeker" && form.maxApplications) {
      limits.maxApplications = form.maxApplications;
    }
    if (form.role === "recruiter" && form.maxJobPosts) {
      limits.maxJobPosts = form.maxJobPosts;
    }
    await onSave({
      ...form,
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      limits,
    });
    setSaving(false);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
      <h3 className="text-base font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-4">
        {plan ? "Edit Plan" : "Create New Plan"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Plan ID *
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={!!plan}
              placeholder="e.g. pro_seeker"
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Pro Seeker"
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description"
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Price Label
            </label>
            <input
              type="text"
              value={form.priceLabel}
              onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
              placeholder="e.g. $9.99/mo"
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Role *
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 cursor-pointer"
            >
              <option value="seeker">Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Interval
            </label>
            <select
              value={form.interval}
              onChange={(e) => setForm({ ...form, interval: e.target.value })}
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 cursor-pointer"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              {form.role === "seeker" ? "Max Applications" : "Max Job Posts"}
            </label>
            <input
              type="number"
              value={form.role === "seeker" ? form.maxApplications : form.maxJobPosts}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                if (form.role === "seeker") {
                  setForm({ ...form, maxApplications: val });
                } else {
                  setForm({ ...form, maxJobPosts: val });
                }
              }}
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
              Stripe Price ID
            </label>
            <input
              type="text"
              value={form.stripePriceId}
              onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })}
              placeholder="price_..."
              className="w-full h-9 rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium font-SecondaryFont text-TextMuted mb-1">
            Features (one per line)
          </label>
          <textarea
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            rows={5}
            placeholder={"5 job applications per month\nBasic profile\nBrowse all jobs"}
            className="w-full rounded-lg border border-Border dark:border-secondary bg-BorderLight dark:bg-secondary/20 px-3 py-2 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 resize-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFree}
            onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
            className="rounded cursor-pointer"
          />
          <label className="text-xs font-SecondaryFont text-TextMuted cursor-pointer">
            Free plan (no payment required)
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.id || !form.name}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-5 py-2.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : plan ? (
              <Pencil size={14} />
            ) : (
              <Plus size={14} />
            )}
            {plan ? "Update Plan" : "Create Plan"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-Border dark:border-secondary px-5 py-2.5 text-sm font-medium font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlansManagementPage;
