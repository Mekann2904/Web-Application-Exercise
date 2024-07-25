document.getElementById('dbfile').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function() {
            let Uints = new Uint8Array(reader.result);
            initSqlJs().then(function(SQL) {
                let db = new SQL.Database(Uints);
                // テーブル名を指定してデータを取得
                let res = db.exec("SELECT * FROM " + table_name);
                
                // データを文字列として整形
                let output = "";
                res.forEach(function(table) {
                    table.columns.forEach(function(column, i) {
                        output += column + "\t";
                    });
                    output += "\n";
                    table.values.forEach(function(row) {
                        row.forEach(function(value, j) {
                            output += value + "\t";
                        });
                        output += "\n";
                    });
                });

                // 結果を表示
                document.getElementById('output').textContent = output;
            });
        };
        reader.readAsArrayBuffer(file);
    }
});