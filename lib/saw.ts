// lib/saw.ts - Simple Additive Weighting (SAW) recommendation
// Updated: Proper SAW implementation with coverage-based scoring

// =============================================================================
// INTERFACES
// =============================================================================

/** User needs dari user_app_usage_summary */
export interface UserNeeds {
  user_id: string;
  need_total: number;    // total_usage_gb
  need_video: number;    // youtube_gb + netflix_gb + disney_gb
  need_game: number;     // games_gb
  need_social: number;   // whatsapp_gb
  need_work: number;     // zoom_gb
}

/** User price behaviour dari user_price_behaviour */
export interface UserPriceBehaviour {
  user_id: string;
  avg_price: number;                                    // Average price user usually pays
  max_price: number;                                    // Hard constraint budget
  price_sensitivity: 'HIGH' | 'MEDIUM' | 'LOW';         // Untuk menentukan w_cost
}

/** User lifecycle dari user_lifecycle */
export interface UserLifecycle {
  user_id: string;
  lifecycle_status: 'ACTIVE' | 'WARNING' | 'CHURN_RISK';  // Untuk tweak bobot
}

/** Package dari package_catalog */
export interface PackageCatalog {
  id: string;
  name: string;
  type: 'REGULAR' | 'COMBO' | 'APP_ONLY';
  price: number;
  days: number;
  main: number;    // Kuota utama
  video: number;   // Bonus video
  game: number;    // Bonus game
  social: number;  // Bonus social (WhatsApp, etc)
  work: number;    // Bonus work (Zoom, etc)
}

/** Computed weights untuk SAW */
export interface SAWWeights {
  w_cost: number;
  w_total: number;
  w_video: number;
  w_game: number;
  w_social: number;
  w_work: number;
}

/** Coverage scores untuk paket */
export interface CoverageScores {
  cov_total: number;
  cov_video: number;
  cov_game: number;
  cov_social: number;
  cov_work: number;
  score_cost: number;
}

/** Scored package dengan detail SAW */
export interface ScoredPackage extends PackageCatalog {
  price_per_day: number;
  coverage: CoverageScores;
  score: number;
  score_percent: number;
  explanation: string;
}

/** SAW Result dengan debug info */
export interface SAWResult {
  recommendations: ScoredPackage[];
  weights: SAWWeights;
  user_needs: UserNeeds;
  fallback_used: boolean;
  fallback_reason?: string;
  candidates_count: number;
  filtered_count: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CATEGORY_WEIGHT_FACTOR = 0.45;  // Max 45% bobot ke kategori spesifik
const MIN_WEIGHT_TOTAL = 0.10;        // Minimum bobot untuk coverage total
const MIN_WEIGHT_COST = 0.10;         // Minimum bobot cost
const SMALL_NEED_THRESHOLD = 15;      // GB, threshold untuk exclude APP_ONLY

// Price sensitivity to w_cost mapping
const PRICE_SENSITIVITY_WEIGHTS: Record<string, number> = {
  HIGH: 0.35,
  MEDIUM: 0.25,
  LOW: 0.15,
};

// Lifecycle tweak for w_cost
const LIFECYCLE_COST_ADJUSTMENT: Record<string, number> = {
  CHURN_RISK: -0.05,  // Prioritize value over cost
  WARNING: -0.02,
  ACTIVE: 0,
};

// =============================================================================
// MAIN SAW FUNCTION
// =============================================================================

/**
 * SAW Recommendation dengan implementasi yang benar
 * 
 * Flow:
 * 1. Filter candidates by budget + type
 * 2. Compute coverage scores (0..1)
 * 3. Compute automatic weights (personalized)
 * 4. Compute SAW score
 * 5. Rank dan return top-N + debug payload
 */
export function recommendSaw(
  packages: PackageCatalog[],
  userNeeds: UserNeeds,
  priceBehaviour: UserPriceBehaviour,
  lifecycle: UserLifecycle,
  topN: number = 3
): SAWResult {
  // ==========================================================================
  // STEP 1: CANDIDATE SELECTION (Gating Rules)
  // ==========================================================================
  
  let candidates = [...packages];
  let fallbackUsed = false;
  let fallbackReason: string | undefined;
  const originalCount = candidates.length;

  // 1.1 Hard filter: budget
  const budgetFiltered = candidates.filter(pkg => pkg.price <= priceBehaviour.max_price);
  
  // 1.2 Filter by type (exclude APP_ONLY kecuali need_total kecil)
  let typeFiltered: PackageCatalog[];
  if (userNeeds.need_total <= SMALL_NEED_THRESHOLD) {
    // Allow all types for small users
    typeFiltered = budgetFiltered;
  } else {
    // Exclude APP_ONLY for larger needs
    typeFiltered = budgetFiltered.filter(pkg => pkg.type !== 'APP_ONLY');
  }

  // Handle empty candidates (fallback)
  if (typeFiltered.length === 0) {
    fallbackUsed = true;
    
    if (budgetFiltered.length > 0) {
      // Budget filtered has items but type filter removed all
      // Use budget filtered (include APP_ONLY as fallback)
      typeFiltered = budgetFiltered;
      fallbackReason = 'No REGULAR/COMBO packages in budget, including APP_ONLY';
    } else {
      // No packages within budget - use cheapest REGULAR/COMBO
      const regularCombo = packages.filter(pkg => pkg.type !== 'APP_ONLY');
      if (regularCombo.length > 0) {
        regularCombo.sort((a, b) => a.price - b.price);
        typeFiltered = [regularCombo[0]]; // Cheapest REGULAR/COMBO
        fallbackReason = `Budget exceeded. Showing cheapest package (Rp${regularCombo[0].price} > max Rp${priceBehaviour.max_price})`;
      } else {
        // Absolute fallback - cheapest overall
        const sorted = [...packages].sort((a, b) => a.price - b.price);
        typeFiltered = [sorted[0]];
        fallbackReason = `Budget exceeded. Showing cheapest available package`;
      }
    }
  }

  candidates = typeFiltered;
  const filteredCount = candidates.length;

  // ==========================================================================
  // STEP 2: COMPUTE WEIGHTS (Personalized)
  // ==========================================================================

  const weights = computeWeights(userNeeds, priceBehaviour, lifecycle);

  // ==========================================================================
  // STEP 3: COMPUTE COVERAGE SCORES & COST NORMALIZATION
  // ==========================================================================

  // Compute price_per_day for all candidates
  const candidatesWithCost = candidates.map(pkg => ({
    ...pkg,
    price_per_day: pkg.days > 0 ? pkg.price / pkg.days : pkg.price,
  }));

  // Find min cost for normalization
  const minCost = Math.min(...candidatesWithCost.map(c => c.price_per_day));

  // ==========================================================================
  // STEP 4: COMPUTE SAW SCORES
  // ==========================================================================

  const scored: ScoredPackage[] = candidatesWithCost.map(pkg => {
    const coverage = computeCoverage(pkg, userNeeds, minCost);
    
    // SAW Score = weighted sum of normalized criteria
    const score = 
      weights.w_total * coverage.cov_total +
      weights.w_video * coverage.cov_video +
      weights.w_game * coverage.cov_game +
      weights.w_social * coverage.cov_social +
      weights.w_work * coverage.cov_work +
      weights.w_cost * coverage.score_cost;

    const scorePercent = score * 100;

    // Generate explanation
    const explanation = generateExplanation(pkg, coverage, weights, userNeeds);

    return {
      ...pkg,
      coverage,
      score,
      score_percent: Math.round(scorePercent * 10) / 10, // 1 decimal
      explanation,
    };
  });

  // ==========================================================================
  // STEP 5: RANK AND RETURN
  // ==========================================================================

  scored.sort((a, b) => b.score - a.score);
  const recommendations = scored.slice(0, topN);

  return {
    recommendations,
    weights,
    user_needs: userNeeds,
    fallback_used: fallbackUsed,
    fallback_reason: fallbackReason,
    candidates_count: originalCount,
    filtered_count: filteredCount,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Compute personalized weights based on user profile
 */
function computeWeights(
  userNeeds: UserNeeds,
  priceBehaviour: UserPriceBehaviour,
  lifecycle: UserLifecycle
): SAWWeights {
  // 5.1 Proporsi kebutuhan
  const needTotal = Math.max(userNeeds.need_total, 1); // Avoid division by zero
  const p_video = userNeeds.need_video / needTotal;
  const p_game = userNeeds.need_game / needTotal;
  const p_social = userNeeds.need_social / needTotal;
  const p_work = userNeeds.need_work / needTotal;

  // 5.2 Bobot cost dari price sensitivity
  let w_cost = PRICE_SENSITIVITY_WEIGHTS[priceBehaviour.price_sensitivity] || 0.25;

  // 5.3 Lifecycle tweak
  w_cost += LIFECYCLE_COST_ADJUSTMENT[lifecycle.lifecycle_status] || 0;

  // Clamp w_cost
  w_cost = Math.max(w_cost, MIN_WEIGHT_COST);

  // 5.4 Alokasikan bobot kategori (dengan k = CATEGORY_WEIGHT_FACTOR)
  let w_video = CATEGORY_WEIGHT_FACTOR * p_video;
  let w_game = CATEGORY_WEIGHT_FACTOR * p_game;
  let w_social = CATEGORY_WEIGHT_FACTOR * p_social;
  let w_work = CATEGORY_WEIGHT_FACTOR * p_work;

  // Hitung w_total sebagai sisa
  let w_total = 1 - (w_cost + w_video + w_game + w_social + w_work);

  // Clamp dan renormalize jika perlu
  if (w_total < MIN_WEIGHT_TOTAL) {
    w_total = MIN_WEIGHT_TOTAL;
    
    // Renormalize kategori proporsional
    const categorySum = w_video + w_game + w_social + w_work;
    const available = 1 - w_cost - w_total;
    
    if (categorySum > 0 && available > 0) {
      const scaleFactor = available / categorySum;
      w_video *= scaleFactor;
      w_game *= scaleFactor;
      w_social *= scaleFactor;
      w_work *= scaleFactor;
    } else {
      w_video = 0;
      w_game = 0;
      w_social = 0;
      w_work = 0;
    }
  }

  // Ensure non-negative
  w_video = Math.max(w_video, 0);
  w_game = Math.max(w_game, 0);
  w_social = Math.max(w_social, 0);
  w_work = Math.max(w_work, 0);

  // Final normalization to ensure sum = 1
  const sum = w_cost + w_total + w_video + w_game + w_social + w_work;
  if (Math.abs(sum - 1) > 0.001) {
    const normalizer = 1 / sum;
    w_cost *= normalizer;
    w_total *= normalizer;
    w_video *= normalizer;
    w_game *= normalizer;
    w_social *= normalizer;
    w_work *= normalizer;
  }

  return {
    w_cost: Math.round(w_cost * 1000) / 1000,
    w_total: Math.round(w_total * 1000) / 1000,
    w_video: Math.round(w_video * 1000) / 1000,
    w_game: Math.round(w_game * 1000) / 1000,
    w_social: Math.round(w_social * 1000) / 1000,
    w_work: Math.round(w_work * 1000) / 1000,
  };
}

/**
 * Compute coverage scores for a package
 * All scores are normalized to 0..1
 */
function computeCoverage(
  pkg: PackageCatalog & { price_per_day: number },
  userNeeds: UserNeeds,
  minCost: number
): CoverageScores {
  // 4.1 Coverage total (utama)
  // supply_total = main
  const supplyTotal = pkg.main;
  const cov_total = userNeeds.need_total > 0 
    ? Math.min(supplyTotal / userNeeds.need_total, 1) 
    : 1;

  // 4.2 Coverage video
  // User bisa pakai kuota utama + bonus video
  const supplyVideo = pkg.main + pkg.video;
  const cov_video = userNeeds.need_video > 0 
    ? Math.min(supplyVideo / userNeeds.need_video, 1) 
    : 1; // Tidak butuh video = score penuh

  // 4.3 Coverage game
  const supplyGame = pkg.main + pkg.game;
  const cov_game = userNeeds.need_game > 0 
    ? Math.min(supplyGame / userNeeds.need_game, 1) 
    : 1; // Tidak butuh game = score penuh

  // 4.4 Coverage social
  const supplySocial = pkg.main + pkg.social;
  const cov_social = userNeeds.need_social > 0 
    ? Math.min(supplySocial / userNeeds.need_social, 1) 
    : 1; // Tidak butuh social = score penuh

  // 4.5 Coverage work
  const supplyWork = pkg.main + pkg.work;
  const cov_work = userNeeds.need_work > 0 
    ? Math.min(supplyWork / userNeeds.need_work, 1) 
    : 1; // Tidak butuh work = score penuh

  // 6.1 Normalisasi cost (min ratio)
  // score_cost = min_cost / cost (0..1)
  const score_cost = minCost > 0 && pkg.price_per_day > 0
    ? minCost / pkg.price_per_day
    : 1;

  return {
    cov_total: Math.round(cov_total * 1000) / 1000,
    cov_video: Math.round(cov_video * 1000) / 1000,
    cov_game: Math.round(cov_game * 1000) / 1000,
    cov_social: Math.round(cov_social * 1000) / 1000,
    cov_work: Math.round(cov_work * 1000) / 1000,
    score_cost: Math.round(score_cost * 1000) / 1000,
  };
}

/**
 * Generate human-readable explanation for recommendation
 */
function generateExplanation(
  pkg: PackageCatalog & { price_per_day: number },
  coverage: CoverageScores,
  weights: SAWWeights,
  userNeeds: UserNeeds
): string {
  const parts: string[] = [];

  // Highlight best coverage
  if (coverage.cov_total >= 0.8) {
    parts.push(`Kuota utama memenuhi ${Math.round(coverage.cov_total * 100)}% kebutuhan`);
  } else if (coverage.cov_total >= 0.5) {
    parts.push(`Kuota utama memenuhi ${Math.round(coverage.cov_total * 100)}% kebutuhan`);
  }

  // Video highlight (jika user butuh dan coverage bagus)
  if (userNeeds.need_video > 0 && coverage.cov_video >= 0.8 && weights.w_video > 0.1) {
    parts.push(`Video match ${Math.round(coverage.cov_video * 100)}%`);
  }

  // Game highlight
  if (userNeeds.need_game > 0 && coverage.cov_game >= 0.8 && weights.w_game > 0.1) {
    parts.push(`Game match ${Math.round(coverage.cov_game * 100)}%`);
  }

  // Social highlight
  if (userNeeds.need_social > 0 && coverage.cov_social >= 0.8 && weights.w_social > 0.1) {
    parts.push(`Social match ${Math.round(coverage.cov_social * 100)}%`);
  }

  // Work highlight
  if (userNeeds.need_work > 0 && coverage.cov_work >= 0.8 && weights.w_work > 0.1) {
    parts.push(`Work match ${Math.round(coverage.cov_work * 100)}%`);
  }

  // Cost highlight
  if (coverage.score_cost >= 0.9) {
    parts.push(`Harga paling hemat (Rp${Math.round(pkg.price_per_day).toLocaleString('id-ID')}/hari)`);
  } else if (coverage.score_cost >= 0.7) {
    parts.push(`Hemat (Rp${Math.round(pkg.price_per_day).toLocaleString('id-ID')}/hari)`);
  }

  // Package type note
  if (pkg.type === 'COMBO' && (pkg.video > 0 || pkg.game > 0 || pkg.social > 0 || pkg.work > 0)) {
    const bonuses: string[] = [];
    if (pkg.video > 0) bonuses.push(`Video ${pkg.video}GB`);
    if (pkg.game > 0) bonuses.push(`Game ${pkg.game}GB`);
    if (pkg.social > 0) bonuses.push(`Social ${pkg.social}GB`);
    if (pkg.work > 0) bonuses.push(`Work ${pkg.work}GB`);
    parts.push(`Bonus: ${bonuses.join(', ')}`);
  }

  if (parts.length === 0) {
    parts.push(`Sesuai dengan profil penggunaan Anda`);
  }

  return parts.join(' • ');
}

// =============================================================================
// LEGACY EXPORTS (Backward compatibility)
// =============================================================================

// Legacy interfaces untuk backward compatibility
export interface UsageRow {
  user_id: string;
  video_pct: number;
  games_pct: number;
  social_pct: number;
  work_pct: number;
  flex_pct: number;
}

export interface PriceRow {
  user_id: string;
  price_avg: number;
}

export interface LifecycleRow {
  user_id: string;
  days_avg: number;
}

export interface PackageRow {
  package_id: string;
  price: number;
  days: number;
  quota_gb: number;
  video_gb: number;
  games_gb: number;
  social_gb: number;
  work_gb: number;
  flex_gb: number;
}
