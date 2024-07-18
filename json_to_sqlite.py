import os
import pandas as pd
import sqlite3
import json
from config import file_path

def load_json_file(file_path):
    """
    指定されたJSONファイルを読み込み、データをリストに格納します。
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    return data

def save_data_to_sqlite(data_list, db_path):
    """
    データリストをSQLiteデータベースに保存します。
    """
    df = pd.DataFrame(data_list)
    df.fillna('不明', inplace=True)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS shelters (
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

    df.to_sql('shelters', conn, if_exists='append', index=False)

    conn.commit()
    conn.close()

def main():
    # JSONファイルのパスを指定
    file_path = 'evacuation_site.json'
    db_path = 'shelters.db'

    data_list = load_json_file(file_path)
    save_data_to_sqlite(data_list, db_path)

if __name__ == '__main__':
    main()