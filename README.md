# Event Calendar
ちょっとしたイベント付きのカレンダーをサイト上に表示したい時に便利なカレンダープラグインです。
APIを簡単に差し替える事が可能で、複数のAPIを読む事が可能なので、PHPなどのでjsonを作成すれば、簡単に表示する事ができ、サイトにマッチするように、デザインテーマを複数用意し、CSSを読み替えるだけOKです。
例えば、お店の定休日を喚起するカレンダーとして利用したり、Googleカレンダーと連携したプログラムを用意して、スケジュールをサイトに埋め込むなど、様々な用途に合わせてご利用ください。

## Demo
以下のページよりデモを確認する事ができます。
https://wepromedia.net/tag/EventCalendar/

## Setup
このプラグインはjQueryに依存していますので、合わせて読み込む必要があります。

    <link rel="stylesheet" href="./css/event_calendar.css">
    <script src="./lib/jquery.min.js"></script>
    <script src="./jquery.event_calendar.js"></script>
    <script>
        $(".calendar").eventCalendar();
    </script>

## Options

| キー | 説明 | タイプ |デフォルト|
|:-----------|:------------|:------------|:------------|
|api|イベント情報のファイルパスを配列で挿入します。|Array|[./json/calendar.json]|
|week|週間表記を設定する事ができます|Array|["日","月","火","水","木","金","土"]|
|width|カレンダー全体の横幅設定です。ピクセル指定もしくはパーセント指定を行ってください。|String|100%|
|thema|デザインのテーマを指定します。|String|calendar_default|
|target_obj|日付を押下した時の出力先を指定します。デフォルトで日付が入っている場合は、その日付の月をカレンダーのデフォルト表示に変更します。|String|false|
|target_click|上記のtarget_objを指定している場合、その対象のオブジェクトをクリックした時にカレンダーを表示するかを指定します。trueの場合、フォーカスが入った際、表示されます。|boolean|true|
|calender_icon|カレンダーのアイコンを表示します。|boolean|true|
|title_format|カレンダーのタイトル表示のフォーマットを指定します。YYYYが年になり、MMが月の表示になります。|String|YYYY/MM|

## Method
独自のアイコンでカレンダーのオンオフをしたい場合など、別のイベントに絡めて、表示切り替えを行いたい時など、ご利用ください。

| method | 説明 |
|:-----------|:------------|
|open|対象のカレンダーをオープンします|
|close|対象のカレンダーをクローズします|

## Changelog

### Version 1.0
- Event Calendarをリリースしました。