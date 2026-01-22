import { NextResponse } from "next/server";
import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getDdb } from "../../../lib/ddb";
import { 
  recommendSaw, 
  UserNeeds, 
  UserPriceBehaviour, 
  UserLifecycle, 
  PackageCatalog,
  SAWResult 
} from "../../../lib/saw";

export async function POST(req: Request) {
  try {
    const { user_id, top_n } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const ddb = getDdb();

    const TABLE_USAGE = process.env.TABLE_USAGE!;
    const TABLE_PRICE = process.env.TABLE_PRICE!;
    const TABLE_LIFECYCLE = process.env.TABLE_LIFECYCLE!;
    const TABLE_PACKAGE_CATALOG = process.env.TABLE_PACKAGE_CATALOG!;

    // 1) Get user rows from DynamoDB
    const [usageRes, priceRes, lifeRes] = await Promise.all([
      ddb.send(new GetCommand({ TableName: TABLE_USAGE, Key: { user_id } })),
      ddb.send(new GetCommand({ TableName: TABLE_PRICE, Key: { user_id } })),
      ddb.send(new GetCommand({ TableName: TABLE_LIFECYCLE, Key: { user_id } })),
    ]);

    if (!usageRes.Item || !priceRes.Item || !lifeRes.Item) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // 2) Scan packages catalog
    const catalogRes = await ddb.send(new ScanCommand({ TableName: TABLE_PACKAGE_CATALOG }));
    const catalog = (catalogRes.Items ?? []) as any[];

    // 3) Transform raw data ke interface baru
    const usage = usageRes.Item as any;
    const price = priceRes.Item as any;
    const life = lifeRes.Item as any;

    // ==========================================================================
    // USER NEEDS (dari user_app_usage_summary)
    // ==========================================================================
    // need_total = total_usage_gb
    // need_video = youtube_gb + netflix_gb + disney_gb
    // need_game = games_gb
    // need_social = whatsapp_gb
    // need_work = zoom_gb
    const userNeeds: UserNeeds = {
      user_id: usage.user_id,
      need_total: Number(usage.total_usage_gb) || 0,
      need_video: (Number(usage.youtube_gb) || 0) + (Number(usage.netflix_gb) || 0) + (Number(usage.disney_gb) || 0),
      need_game: Number(usage.games_gb) || 0,
      need_social: Number(usage.whatsapp_gb) || 0,
      need_work: Number(usage.zoom_gb) || 0,
    };

    // ==========================================================================
    // USER PRICE BEHAVIOUR (dari user_price_behaviour)
    // ==========================================================================
    // max_price sebagai hard constraint
    // price_sensitivity untuk menentukan bobot cost
    const priceBehaviour: UserPriceBehaviour = {
      user_id: price.user_id,
      avg_price: Number(price.avg_price) || 100000,
      max_price: Number(price.max_price) || Number(price.avg_price) * 1.5 || 100000,
      price_sensitivity: (price.price_sensitivity as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
    };

    // ==========================================================================
    // USER LIFECYCLE (dari user_lifecycle)
    // ==========================================================================
    // lifecycle_status untuk tweak bobot
    const lifecycle: UserLifecycle = {
      user_id: life.user_id,
      lifecycle_status: (life.lifecycle_status as 'ACTIVE' | 'WARNING' | 'CHURN_RISK') || 'ACTIVE',
    };

    // ==========================================================================
    // PACKAGE CATALOG
    // ==========================================================================
    const packages: PackageCatalog[] = catalog.map((p: any) => ({
      id: String(p.id || p.package_id || ''),
      name: String(p.name || ''),
      type: (p.type as 'REGULAR' | 'COMBO' | 'APP_ONLY') || 'REGULAR',
      price: Number(p.price) || 0,
      days: Number(p.days) || 1,
      main: Number(p.main) || 0,
      video: Number(p.video) || 0,
      game: Number(p.game) || 0,
      social: Number(p.social) || 0,
      work: Number(p.work) || 0,
    }));

    console.log('=== SAW RECOMMENDATION DEBUG ===');
    console.log('User Needs:', JSON.stringify(userNeeds, null, 2));
    console.log('Price Behaviour:', JSON.stringify(priceBehaviour, null, 2));
    console.log('Lifecycle:', JSON.stringify(lifecycle, null, 2));
    console.log('Packages count:', packages.length);

    // ==========================================================================
    // RUN SAW RECOMMENDATION
    // ==========================================================================
    const sawResult: SAWResult = recommendSaw(
      packages, 
      userNeeds, 
      priceBehaviour, 
      lifecycle, 
      Number(top_n ?? 3)
    );

    console.log('SAW Weights:', JSON.stringify(sawResult.weights, null, 2));
    console.log('Recommendations:', sawResult.recommendations.map(r => ({
      id: r.id,
      name: r.name,
      score_percent: r.score_percent,
      coverage: r.coverage,
    })));

    // ==========================================================================
    // RETURN RESPONSE
    // ==========================================================================
    return NextResponse.json({
      user_id,
      profile: {
        needs: userNeeds,
        price_behaviour: priceBehaviour,
        lifecycle: lifecycle,
      },
      saw_debug: {
        weights: sawResult.weights,
        candidates_count: sawResult.candidates_count,
        filtered_count: sawResult.filtered_count,
        fallback_used: sawResult.fallback_used,
        fallback_reason: sawResult.fallback_reason,
      },
      recommendations: sawResult.recommendations.map(rec => ({
        package_id: rec.id,
        name: rec.name,
        type: rec.type,
        price: rec.price,
        days: rec.days,
        main_gb: rec.main,
        video_gb: rec.video,
        game_gb: rec.game,
        social_gb: rec.social,
        work_gb: rec.work,
        price_per_day: rec.price_per_day,
        coverage: rec.coverage,
        score: rec.score,
        score_percent: rec.score_percent,
        explanation: rec.explanation,
      })),
    });
  } catch (e: any) {
    console.error('Error in /api/recommend:', {
      message: e?.message,
      code: e?.code,
      stack: e?.stack,
    });
    return NextResponse.json(
      { error: e?.message ?? "Unknown error", details: process.env.NODE_ENV === 'development' ? e?.stack : undefined },
      { status: 500 }
    );
  }
}
