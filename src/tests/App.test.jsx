import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

const useMock = false;
describe('Appコンポーネント', () => {
  test('登録内容が確認可能である', async () => {
    if (useMock == false) {
      render(<App />)

      expect(screen.queryByText(/Now Loading.../)).toBeInTheDocument();
      expect(await screen.findByTestId("RecordList")).toBeVisible();
      //      screen.debug();
    }
  });

  test('勉強記録の追加', async () => {
    //ユーザーイベントのセットアップ
    const user = userEvent.setup();
    //コンポーネントのレンダリング
    render(<App />)

    //レコードリストがレンダリングされるまで待機
    await screen.findByTestId("RecordList");

    //追加前のレコード数を取得
    const itemNumBefore = screen.getAllByRole("listitem").length

    //ユーザー操作のシミュレート
    const testStr = "べんきょーした"
    const testTime = "10"
    await user.type(screen.getByTestId("TitleText"), testStr);
    fireEvent.change(screen.getByTestId("Time"), { target: { value: testTime } });
    await user.click(await screen.findByRole("button", { name: "登録" }))

    //レコードリストが再レンダリングされるまで待機
    await screen.findByTestId("RecordList");

    //追加後のレコード数を取得
    const itemNumAfter = screen.getAllByRole("listitem").length

    //追加前後のレコード数比較
    expect(itemNumAfter).toEqual(itemNumBefore + 1);
  })

  test('勉強記録の削除', async () => {
    const user = userEvent.setup();
    render(<App />)

    await screen.findByTestId("RecordList");

    const itemNumBefore = screen.getAllByRole("listitem").length

    //最後の削除ボタンを取得
    const deleteButtons = await screen.findAllByRole("button", { name: "削除" })
    const deleteTarget = deleteButtons.at(-1)
    await user.click(deleteTarget)

    await screen.findByTestId("RecordList");

    const itemNumAfter = screen.getAllByRole("listitem").length
    expect(itemNumAfter).toEqual(itemNumBefore - 1);
  })

  test('未入力時のエラーメッセージ', async () => {
    const user = userEvent.setup();
    render(<App />)

    await screen.findByTestId("RecordList");
    await user.click(await screen.findByRole("button", { name: "登録" }))
    expect(screen.getByText("入力されていない項目があります。")).toBeVisible();
  })
})
