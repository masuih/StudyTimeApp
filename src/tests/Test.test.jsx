import { foo, bar } from '../Test.jsx';

jest.mock('../Test')

describe('Mockテスト', () => {
  test('jest.fn()', () => {
    const mockfn = jest.fn()

    //返り値を指定。
    //mockReturnValueOnceでは呼び出した順に返す返り値を指定できる。
    //mockReturnValueOnceを使い切った場合は、mockReturnValueの値が使用される。
    mockfn
      .mockReturnValue(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)

    const firstReturnValue = mockfn(1);
    const secondReturnValue = mockfn(2);
    const thirdReturnValue = mockfn(3);

    //呼び出しは3回
    expect(mockfn.mock.calls).toHaveLength(3);

    //2回目の呼び出しの第1引数は2
    expect(mockfn.mock.calls[1][0]).toBe(2);

    //返り値は順に1,2,0
    expect(firstReturnValue).toBe(1)
    expect(secondReturnValue).toBe(2)
    expect(thirdReturnValue).toBe(0)

    //mock関数の実装
    mockfn.mockImplementation(() => { return 3 });

    //実装により返り値として3が返る
    expect(mockfn()).toBe(3)
  })

  test('jest.spyOn()', () => {
    //オブジェクトのメソッドを定義
    const testObj = {
      fn: (i) => { return i }
    }

    //オブジェクトのメソッドをスパイする
    const spy = jest.spyOn(testObj, 'fn');

    //元のメソッドの実装は変わらない
    expect(testObj.fn(3)).toBe(3)

    //mock関数同様、呼び出し回数などを取得できる
    expect(spy.mock.calls).toHaveLength(1);

    //元のメソッドの実装を上書き。変更はテストをまたぐ。
    spy.mockImplementation((i) => { return i + 100 });
    expect(testObj.fn(3)).toBe(103)

    //元のメソッドの実装へ戻す
    spy.mockRestore();
    expect(testObj.fn(3)).toBe(3)
  })

  test('jest.mock()', () => {
    //fooの返り値を上書き
    foo.mockReturnValue('foofoofoo');
    expect(foo()).toBe('foofoofoo');

    //mockプロパティにもアクセス可能
    expect(foo.mock.calls).toHaveLength(1)

    //barの実装を上書き
    bar.mockImplementation(() => { return 'baz' })
    expect(bar()).toBe('baz')

    //barのメソッド確認
    console.log({ bar })
  })
})
