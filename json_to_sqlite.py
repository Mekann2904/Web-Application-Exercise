import os
import pandas as pd
import sqlite3
import json

def load_json_file(file_path):
    """
    指定されたJSONファイルを読み込み、データをリストに格納します。
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print(f"ファイルが見つかりません: {file_path}")
        return []
    except json.JSONDecodeError:
        print(f"JSONファイルの読み込みに失敗しました: {file_path}")
        return []

def initialize_database(db_path):
    """
    SQLiteデータベースを初期化します（既存のテーブルを削除してから再作成）。
    """
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        
        # 既存のテーブルを削除
        cursor.execute('DROP TABLE IF EXISTS shelters')
        
        # 新しいテーブルを作成
        cursor.execute('''
        CREATE TABLE shelters (
            都道府県コード TEXT,
            NO INTEGER,
            名称 TEXT,
            名称_カナ TEXT,
            住所 TEXT,
            市区町村コード TEXT,
            都道府県名 TEXT,
            市区町村名 TEXT,
            災害種別_洪水 TEXT,
            災害種別_崖崩れ TEXT,
            災害種別_高波 TEXT,
            災害種別_地割れ TEXT,
            災害種別_津波 TEXT,
            指定避難所 TEXT
        )
        ''')

def save_data_to_sqlite(data_list, db_path):
    """
    データリストをSQLiteデータベースに保存します。
    """
    if not data_list:
        print("保存するデータがありません。")
        return

    df = pd.DataFrame(data_list)
    df.fillna('不明', inplace=True)

    with sqlite3.connect(db_path) as conn:
        df.to_sql('shelters', conn, if_exists='append', index=False)

def main():
    # JSONファイルのパスを指定
    file_path = 'evacuation_site.json'
    db_path = 'shelters.db'

    data_list = load_json_file(file_path)
    
    # データベースの初期化
    initialize_database(db_path)
    
    # データの保存
    save_data_to_sqlite(data_list, db_path)

if __name__ == '__main__':
    main()