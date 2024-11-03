import { deleteRecordFromSupabase, getAllRecord, insertRecordToSupabase } from './Supabase';
import { useState, useEffect } from 'react';

export const App = () => {
  const [totalTime, setTotalTime] = useState(0);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(0);
  const [records, setRecords] = useState([]);
  const [isRecordLoading, setIsRecordLoading] = useState(true);
  const [isInputAll, setIsInputAll] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllRecord();
      setRecords(data);
      setTotalTime(CalcTotalTime(data))
      setIsRecordLoading(false);
    }
    fetchData()
  }, []);

  const CalcTotalTime = (props) => {
    let total = 0;
    props.map((item) => {
      total = total + (item.time - 0);
    });
    return total;
  }

  const RecordList = () => {
    return (
      <ul data-testid="RecordList">
        {records.map((item) => (
          <li key={item.id}>
            {item.title}: {item.time}
            <button onClick={() => onClickDeleteRecord(item.id)}>削除</button>
          </li>
        ))}
      </ul>
    );
  };
  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeTime = (event) => setTime(event.target.value);
  const onClickDeleteRecord = (id) => {
    deleteRecordFromSupabase(id)
    const newRecords = records.filter((item) => { return item.id != id })
    setRecords(newRecords)
    setTotalTime(CalcTotalTime(newRecords));
  }
  const onSubmitClick = () => {
    if (title == '' || time == 0) {
      setIsInputAll(false)
      return;
    }

    const id = insertRecordToSupabase(title, time)

    const newRecords = [...records, { id, title, time }];
    setRecords(newRecords);

    setTotalTime(CalcTotalTime(newRecords));

    setTitle('');
    setTime(0);
    setIsInputAll(true)
  };

  return (
    <>
      <p>学習記録一覧</p>
      {isRecordLoading ? <p>Now Loading...</p> : <RecordList />}
      Title: <input value={title} data-testid="TitleText" onChange={onChangeTitle}></input>
      <br />
      Time: <input type="number" value={time} data-testid="Time" onChange={onChangeTime}></input>
      時間
      <br />
      <button onClick={onSubmitClick}>登録</button>
      {!isInputAll && (
        <p style={{ color: 'red' }}>入力されていない項目があります。</p>
      )}
      合計時間： {totalTime} / 1000(h)
    </>
  );
};
