-- ============================================================
-- サンプルデータ投入
-- 実行: psql $DATABASE_URL -f scripts/seed.sql
-- ============================================================

-- 顧客
INSERT INTO customers (customer_name, company_name, email, phone) VALUES
  ('田中 健太',   '株式会社リードテック',     'tanaka@leadtech.co.jp',   '03-1234-5678'),
  ('佐藤 美咲',   'サトウデザイン事務所',     'sato@satodesign.jp',      '090-2345-6789'),
  ('山本 拓也',   NULL,                       'yamamoto@gmail.com',      '080-3456-7890'),
  ('鈴木 裕子',   '鈴木商事株式会社',         'suzuki@suzukishoji.jp',   '06-5678-9012');

-- 案件
INSERT INTO projects (customer_id, project_name, project_description) VALUES
  (1, 'コーポレートサイト リニューアル',   'トップ・会社概要・サービス・採用・お問い合わせの5ページ構成。CMSはWordPress導入予定。'),
  (1, '採用LP制作',                        '新卒採用向けランディングページ。動画バナーあり。'),
  (2, 'ブランドロゴ・VI制作',              'ロゴ・名刺・封筒・会社案内パンフレットのデザイン一式。'),
  (3, 'ECサイト構築',                      'Shopifyベースのアパレル向けECサイト。商品数は約100点。'),
  (4, '社内業務管理システム',              '在庫管理・発注管理・売上集計の3機能。Next.js + PostgreSQL。');

-- 見積（status バリエーションあり）
INSERT INTO estimates (project_id, total_amount, status, created_at) VALUES
  (1, 680000,  'approved', NOW() - INTERVAL '30 days'),
  (2, 150000,  'sent',     NOW() - INTERVAL '10 days'),
  (3, 320000,  'approved', NOW() - INTERVAL '25 days'),
  (4, 450000,  'draft',    NOW() - INTERVAL '3 days'),
  (5, 980000,  'sent',     NOW() - INTERVAL '7 days'),
  (1, 220000,  'rejected', NOW() - INTERVAL '45 days'),
  (3, 85000,   'draft',    NOW() - INTERVAL '1 day');

-- 見積項目

-- 見積1: コーポレートサイト リニューアル（承認済み）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (1, 'デザイン制作（5ページ）',     150000, 1, 150000, 'PC・SP対応'),
  (1, 'フロントエンド実装',           200000, 1, 200000, 'HTML/CSS/JS'),
  (1, 'WordPress導入・CMS設定',        80000, 1,  80000, 'テーマカスタマイズ含む'),
  (1, 'ディレクション',                50000, 1,  50000, NULL),
  (1, 'サーバー・ドメイン初期設定',    30000, 1,  30000, '年間費用別途'),
  (1, 'コンテンツ入稿サポート',        20000, 1,  20000, NULL);

-- 見積2: 採用LP制作（送付済み）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (2, 'LPデザイン',                    80000, 1,  80000, 'SP対応込み'),
  (2, 'フロントエンド実装',            50000, 1,  50000, NULL),
  (2, '動画バナー制作',                20000, 1,  20000, '素材支給の場合');

-- 見積3: ブランドVI制作（承認済み）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (3, 'ロゴデザイン（3案提出）',      120000, 1, 120000, '修正2回まで含む'),
  (3, '名刺デザイン・入稿',            25000, 1,  25000, '両面デザイン'),
  (3, '封筒デザイン・入稿',            20000, 1,  20000, '長3封筒'),
  (3, '会社案内パンフレット（A4/4P）', 100000, 1, 100000, '印刷費別途'),
  (3, 'ガイドライン資料作成',          55000, 1,  55000, NULL);

-- 見積4: ECサイト構築（下書き）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (4, 'Shopify初期設定',               50000, 1,  50000, NULL),
  (4, 'テーマカスタマイズ',           150000, 1, 150000, 'オリジナルデザイン適用'),
  (4, '商品登録サポート',               1500, 100, 150000, '100商品分'),
  (4, '決済・配送設定',                30000, 1,  30000, NULL),
  (4, 'テスト・納品',                  20000, 1,  20000, NULL);

-- 見積5: 社内業務管理システム（送付済み）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (5, '要件定義・設計',               120000, 1, 120000, NULL),
  (5, 'フロントエンド開発',           250000, 1, 250000, 'Next.js / TypeScript'),
  (5, 'バックエンド開発',             300000, 1, 300000, 'API設計・DB設計込み'),
  (5, 'テスト・QA',                    80000, 1,  80000, NULL),
  (5, '納品・引き渡し',                50000, 1,  50000, 'ドキュメント一式含む'),
  (5, 'インフラ構築（Vercel + Neon）', 100000, 1, 100000, '初期設定のみ'),
  (5, 'ディレクション・PM',            80000, 1,  80000, NULL);

-- 見積6: 採用LP（却下）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (6, 'LPデザイン',                   100000, 1, 100000, '高品質版'),
  (6, 'フロントエンド実装',            80000, 1,  80000, NULL),
  (6, 'アニメーション実装',            40000, 1,  40000, NULL);

-- 見積7: ブランドVI追加（下書き）
INSERT INTO estimate_items (estimate_id, item_name, unit_price, quantity, subtotal, note) VALUES
  (7, 'SNSアイコン・バナーセット',     40000, 1,  40000, '各種SNS対応サイズ'),
  (7, 'プレゼン資料テンプレート',      45000, 1,  45000, 'PowerPoint形式');
