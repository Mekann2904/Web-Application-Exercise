## README

---

# 防災アプリケーション

## 使用技術一覧

<!-- シールド一覧 -->
<p style="display: inline">
  <img src="https://img.shields.io/badge/-Flask-000000.svg?logo=flask&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Python-000000.svg?logo=python&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Jinja2-000000.svg?logo=jinja&style=for-the-badge">
  <img src="https://img.shields.io/badge/-HTML/CSS/JavaScript-000000.svg?logo=html5&style=for-the-badge">
  <img src="https://img.shields.io/badge/-SQLite-000000.svg?logo=sqlite&style=for-the-badge">
  <img src="https://img.shields.io/badge/-GitHub-000000.svg?logo=github&style=for-the-badge">
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)
5. [詳細設計](#詳細設計)
6. [トラブルシューティング](#トラブルシューティング)

<p align="right">(<a href="#top">トップへ</a>)</p>

## プロジェクトについて

このプロジェクトは、防災アプリケーションを開発するためのテンプレートです。ユーザーは地理情報を入力し、天気情報を取得して表示し、最寄りの避難場所とその経路を確認することができます。

<p align="right">(<a href="#top">トップへ</a>)</p>

## 環境

| 技術       | バージョン |
| ---------- | ---------- |
| Python     | 3.11.4     |
| Flask      | 2.3.2      |
| Jinja2     | 3.1.2      |
| SQLite     | 3.39.3     |
| HTML/CSS/JavaScript | 最新版 |

<p align="right">(<a href="#top">トップへ</a>)</p>

## ディレクトリ構成

```plaintext
project_root/
├── app/
│   ├── __init__.py
│   ├── routes.py
│   ├── models.py
│   ├── static/
│   │   ├── css/
│   │   │   ├── styles.css
│   │   ├── js/
│   │   │   ├── scripts.js
│   ├── templates/
│   │   ├── base.html
│   │   ├── geo_info.html
│   │   ├── weather_info.html
│   │   ├── evacuation_info.html
│   │   └── route_info.html
├── config.py
├── run.py
├── requirements.txt
└── README.md
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 開発環境構築

1. **Python 環境のセットアップ**

   必要なパッケージをインストールします。

   ```bash
   pip install -r requirements.txt
   ```

2. **データベースのセットアップ**

   SQLite データベースを作成します。

   ```bash
   python run.py setup_db
   ```

3. **アプリケーションの起動**

   アプリケーションを起動します。

   ```bash
   python run.py
   ```

4. **アクセス**

   ブラウザで以下のURLにアクセスします。

   ```
   http://127.0.0.1:5000
   ```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 詳細設計

### システム構成図

```mermaid
graph LR
    A[ユーザー] -->|スマホ/PC| B[クライアントアプリ]
    B --> C[Webサーバー]
    C --> D[アプリケーションサーバー]
    D --> E[データベースサーバー]
```

### ソフトウェア構成図

```mermaid
graph TD
    A[フロントエンド] --> B[バックエンド]
    B --> C[データベース]

    subgraph フロントエンド
        A1[HTML]
        A2[CSS]
        A3[JavaScript]
    end

    subgraph バックエンド
        B1[Flask]
        B2[APIエンドポイント]
    end

    subgraph データベース
        C1[SQLite]
    end
```

### 機能設計

1. **地理情報入力**: ユーザーが現在地または指定した場所の情報を入力します。
2. **天気情報表示**: 入力された地理情報に基づき、最新の天気情報を表示します。
3. **避難場所情報表示**: 入力された地理情報に基づき、最寄りの避難場所を表示します。
4. **避難経路表示**: 外部アプリに情報を渡して、避難場所までの最適な経路を表示します。

### 画面設計

1. **地理情報入力画面**
   - 地理情報の入力フィールド
   - 現在地取得ボタン

2. **天気情報表示画面**
   - 現在の天気情報
   - 予報情報

3. **避難場所表示画面**
   - 最寄りの避難場所リスト

4. **避難経路表示画面**
   - 現在地から避難場所までの経路地図

### データベース設計

**地理情報テーブル (geo_info)**

| カラム名       | データ型     | 説明             |
| -------------- | ------------ | ---------------- |
| id             | INTEGER      | プライマリキー   |
| latitude       | FLOAT        | 緯度             |
| longitude      | FLOAT        | 経度             |
| timestamp      | DATETIME     | 記録日時         |
| city_name      | VARCHAR(255) | 都市名           |

**天気情報テーブル (weather_info)**

| カラム名          | データ型     | 説明             |
| ----------------- | ------------ | ---------------- |
| id                | INTEGER      | プライマリキー   |
| geo_info_id       | INTEGER      | 外部キー         |
| temperature       | FLOAT        | 気温             |
| humidity          | FLOAT        | 湿度             |
| weather_condition | VARCHAR(255) | 天気の状態       |
| timestamp         | DATETIME     | 記録日時         |

**避難場所テーブル (evacuation_sites)**

| カラム名           | データ型     | 説明             |
| ------------------ | ------------ | ---------------- |
| id                 | INTEGER      | プライマリキー   |
| name               | VARCHAR(255) | 名称             |
| latitude           | FLOAT        | 緯度             |
| longitude          | FLOAT        | 経度             |
| address            | VARCHAR(255) | 住所             |
| disaster_response  | VARCHAR(255) | 災害対応情報     |

### 処理フロー

**地理情報入力の処理フロー**

```mermaid
sequenceDiagram
    participant User
    participant GeoInputScreen
    participant SQLite

    User->>GeoInputScreen: 地理情報を手動で入力
    GeoInputScreen->>GeoInputScreen: バリデーション
    GeoInputScreen->>User: エラーメッセージ (入力が無効な場合)
    GeoInputScreen->>SQLite: 地理情報を保存 (入力が有効な場合)
    SQLite->>GeoInputScreen: 保存完了の応答
    GeoInputScreen->>User: 保存完了の通知
```

**天気情報表示の処理フロー**

```mermaid
sequenceDiagram
    participant User
    participant SQLite
    participant WeatherDisplayScreen
    participant Server
    participant WeatherAPI

    User->>SQLite: 地理情報を保存
    SQLite->>WeatherDisplayScreen: 地理情報の送信
    WeatherDisplayScreen->>Server: 天気情報取得要求 (地理情報付き)
    Server->>WeatherAPI: 天気情報取得要求
    WeatherAPI->>Server: 天気情報のレスポンス
    Server->>WeatherDisplayScreen: 天気情報の送信
    WeatherDisplayScreen->>User: 天気情報を表示
```

**避難場所情報表示の処理フロー**

```mermaid
sequenceDiagram
    participant User
    participant SQLite
    participant EvacuationDisplayScreen
    participant Server
    participant 国土地理院API

    User->>SQLite: 地理情報を入力
    SQLite->>EvacuationDisplayScreen: 地理情報, 避難場所情報を送信
    EvacuationDisplayScreen->>Server: 地理情報, 避難場所情報を送信
    Server->>国土地理院API: 2点間距離要求
    国土地理院API->>Server: 距離情報のレスポンス
    Server->>EvacuationDisplayScreen: 距離情報の送信
    EvacuationDisplayScreen->>User: 避難場所情報と距離を表示
```

**避難経路表示の処理フロー**

```mermaid
sequenceDiagram
    participant User
    participant Server

    User->>Server: 地理情報つきURL (https://www.google.com/maps/search/?api=1&query=場所名)
    Server->>User: 経路情報を表示 (Googleマップの別タブを開く)
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## トラブルシューティング



<p align="right">(<a href="#top">トップへ</a>)</p>